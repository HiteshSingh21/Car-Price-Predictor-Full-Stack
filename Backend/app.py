# --- Step 0: Imports ---
import os
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify

# PyTorch Tabular & Safe Loading Imports
import torch
import typing
import collections
from omegaconf.base import ContainerMetadata, Metadata
from omegaconf.listconfig import ListConfig
from omegaconf.nodes import AnyNode
from pytorch_tabular import TabularModel

# Database Imports
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, BigInteger, Text
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.sql import func as sql_func
from sqlalchemy import select, distinct
import datetime
import io

# === CONFIGURATION ================================================

# --- 1. Database Configuration ---
DATABASE_URI = os.getenv("DATABASE_URI", "postgresql://postgres:PASSWORD@db.supabase.co:5432/postgres")

# --- 2. Model Configuration ---
MODEL_PATH = "saved_car_model_log_v1"

# --- 3. Define ORIGINAL Column Names ---
ORIGINAL_CATEGORICAL_COLS = [
    'body', 'Drive Type', 'Engine Type', 'fuel', 'owner_type', 
    'state', 'Steering Type', 'transmission', 'utype'
]
ORIGINAL_NUMERICAL_COLS = [
    'myear', 'km', 'No of Cylinder', 'Length', 'Width', 'Height', 'Wheel Base',
    'Kerb Weight', 'Gear Box', 'Seats', 'Max Torque At'
]
ORIGINAL_TARGET_COL = 'listed_price'

# --- DERIVED LISTS ---
CLEANED_CATEGORICAL_COLS = [col.replace(' ', '_').lower() for col in ORIGINAL_CATEGORICAL_COLS]
CLEANED_NUMERICAL_COLS = [col.replace(' ', '_').lower() for col in ORIGINAL_NUMERICAL_COLS]
MODEL_EXPECTED_CLEANED_CAT_COLS = CLEANED_CATEGORICAL_COLS
MODEL_EXPECTED_CLEANED_NUM_COLS = CLEANED_NUMERICAL_COLS

# === INITIALIZATION ===============================================

app = Flask(__name__)

# Add Safe Globals for torch.load
try:
    torch.serialization.add_safe_globals([
        ContainerMetadata, typing.Any, dict, collections.defaultdict,
        ListConfig, list, int, AnyNode, Metadata,
    ])
except AttributeError:
    print("--- Warning: torch.serialization.add_safe_globals not found. Skipping. ---")

# Load the Trained Model
print(f"--- Loading model from {MODEL_PATH}... ---")
model = None
model_expected_cat_cols_internal = None 
if os.path.exists(MODEL_PATH):
    try:
        model = TabularModel.load_model(MODEL_PATH)
        print("--- Model loaded successfully! ---")
        if model and hasattr(model, 'datamodule') and hasattr(model.datamodule, 'categorical_encoder'):
            model_expected_cat_cols_internal = model.datamodule.categorical_encoder.cols
    except Exception as e:
        print(f"!!! ERROR loading model: {e} !!!")
else:
    print(f"!!! ERROR: Model path '{MODEL_PATH}' not found! API cannot predict. !!!")


# Setup Database Connection
print("--- Setting up database connection... ---")
engine = None
SessionLocal = None
Base = None
try:
    # Optimized engine with connection pooling
    engine = create_engine(
        DATABASE_URI,
        pool_pre_ping=True,
        pool_recycle=300
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
    print("--- Database engine created successfully. ---")
except Exception as e:
    print(f"!!! ERROR creating database engine: {e} !!!")

# Define Database Table Models
if Base:
    class PredictionLog(Base):
        __tablename__ = 'predictions'
        id = Column(Integer, primary_key=True, index=True)
        input_myear = Column(Float); input_km = Column(Float)
        input_no_of_cylinder = Column(Float); input_length = Column(Float)
        input_width = Column(Float); input_height = Column(Float)
        input_wheel_base = Column(Float); input_kerb_weight = Column(Float)
        input_gear_box = Column(Float); input_seats = Column(Float)
        input_max_torque_at = Column(Float); input_body = Column(String)
        input_transmission = Column(String); input_fuel = Column(String)
        input_utype = Column(String); input_engine_type = Column(String)
        input_drive_type = Column(String); input_steering_type = Column(String)
        input_state = Column(String); input_owner_type = Column(String)
        predicted_price = Column(Float)
        timestamp = Column(DateTime(timezone=True), server_default=sql_func.now())

    class CarInfo(Base):
        __tablename__ = '"car data"'
        ID = Column("ID", BigInteger, primary_key=True, index=True)
        myear = Column(BigInteger)
        body = Column(Text, index=True)
        transmission = Column(Text)
        fuel = Column(Text, index=True)
        km = Column(BigInteger)
        oem = Column(Text)
        model = Column(Text, index=True)
        variant = Column(Text)
        listed_price = Column(BigInteger)
        utype = Column(Text)
        top_features = Column(Text)
        comfort_features = Column(Text)
        interior_features = Column(Text)
        exterior_features = Column(Text)
        safety_features = Column(Text)
        Color = Column("Color", Text)
        Engine_Type = Column("Engine Type", Text)
        No_of_Cylinder = Column("No of Cylinder", BigInteger)
        Length = Column("Length", Text)
        Width = Column("Width", Text)
        Height = Column("Height", Text)
        Wheel_Base = Column("Wheel Base", Text)
        Kerb_Weight = Column("Kerb Weight", Text)
        Gear_Box = Column("Gear Box", BigInteger)
        Drive_Type = Column("Drive Type", Text)
        Seats = Column("Seats", BigInteger)
        Steering_Type = Column("Steering Type", Text)
        state = Column(Text, index=True)
        owner_type = Column(Text)
        Max_Torque_At = Column("Max Torque At", Text)
        image_url = Column(Text)

    print("--- Database models defined ---")
else:
    print("!!! Database Base model not created. Cannot define tables. !!!")


# === API ENDPOINTS ===============================================

@app.route('/')
def home():
    status = "running"
    if engine is None: status += ", DB connection FAILED"
    if model is None: status += ", Model loading FAILED"
    return jsonify({"message": f"Car Price Prediction API is {status}!"})

@app.route('/predict', methods=['POST'])
def predict_price():
    """ Predicts price based on features, uses SMART SEARCH for similar cars, logs, returns. """
    global model
    if model is None: return jsonify({"error": "Model not loaded"}), 500
    if not SessionLocal: return jsonify({"error": "Database not available"}), 500

    try:
        data = request.get_json()
        if not data: return jsonify({"error": "No input data"}), 400
        print("Received data:", data)

        # --- 1. PREPARE DATA FOR MODEL ---
        input_dict_original = {}
        all_original_cols_for_model = ORIGINAL_CATEGORICAL_COLS + ORIGINAL_NUMERICAL_COLS
        missing_input_fields = []
        invalid_numeric_fields = {}

        for original_col in all_original_cols_for_model:
            cleaned_col_name = original_col.replace(' ', '_').lower()
            if cleaned_col_name not in data:
                missing_input_fields.append(cleaned_col_name)
                continue
            value = data[cleaned_col_name]
            is_expected_numeric = original_col in ORIGINAL_NUMERICAL_COLS

            if is_expected_numeric:
                try:
                    if value is None or str(value).strip() == "": input_dict_original[original_col] = np.nan
                    else: input_dict_original[original_col] = float(value)
                except (ValueError, TypeError): invalid_numeric_fields[cleaned_col_name] = value
            elif original_col in ORIGINAL_CATEGORICAL_COLS:
                input_dict_original[original_col] = str(value) if value is not None else ""

        if missing_input_fields: return jsonify({"error": f"Missing input fields: {', '.join(missing_input_fields)}"}), 400
        if invalid_numeric_fields:
            error_msg = ", ".join([f"'{k}' (value: '{v}')" for k, v in invalid_numeric_fields.items()])
            return jsonify({"error": f"Invalid non-numeric input for field(s): {error_msg}"}), 400

        input_df_original_names = pd.DataFrame([input_dict_original])

        # Impute NaNs
        numeric_nans = input_df_original_names[ORIGINAL_NUMERICAL_COLS].isnull().any()
        for col, has_nan in numeric_nans.items():
            if has_nan: input_df_original_names[col] = input_df_original_names[col].fillna(0).astype(float)
        
        categorical_empty = input_df_original_names[ORIGINAL_CATEGORICAL_COLS].applymap(lambda x: x is None or str(x).strip() == "")
        for col, has_empty in categorical_empty.any().items():
             if has_empty: input_df_original_names[col] = input_df_original_names[col].replace('', "Unknown").fillna("Unknown").astype(str)

        # Convert types
        input_df_original_names[ORIGINAL_CATEGORICAL_COLS] = input_df_original_names[ORIGINAL_CATEGORICAL_COLS].astype(str)
        input_df_original_names[ORIGINAL_NUMERICAL_COLS] = input_df_original_names[ORIGINAL_NUMERICAL_COLS].astype(float)

        # Rename columns
        rename_map = {orig_col: orig_col.replace(' ', '_').lower() for orig_col in all_original_cols_for_model}
        input_df_cleaned_names = input_df_original_names.rename(columns=rename_map)

        # Match columns to model expectations
        if model_expected_cat_cols_internal is not None:
             expected_cols_set = set(model_expected_cat_cols_internal + MODEL_EXPECTED_CLEANED_NUM_COLS)
             actual_cols_set = set(input_df_cleaned_names.columns)
             if expected_cols_set != actual_cols_set:
                  cols_to_keep = [col for col in input_df_cleaned_names.columns if col in expected_cols_set]
                  missing_from_input = expected_cols_set - actual_cols_set
                  if not missing_from_input:
                       input_df_cleaned_names = input_df_cleaned_names[cols_to_keep]
                  else:
                       return jsonify({"error": f"Internal mismatch: Input data missing required model columns: {missing_from_input}"}), 500

        # --- 2. MAKE PREDICTION ---
        print("--- Making prediction... ---")
        prediction_df = model.predict(input_df_cleaned_names)
        
        predicted_price = np.nan
        prediction_result = float('nan')
        
        possible_pred_cols = [f"{ORIGINAL_TARGET_COL}_prediction", f"log_{ORIGINAL_TARGET_COL}_prediction", ORIGINAL_TARGET_COL]
        prediction_col_name = next((col for col in possible_pred_cols if col in prediction_df.columns), None)

        if prediction_col_name:
            raw_prediction = prediction_df[prediction_col_name].values[0]
            if not pd.isna(raw_prediction):
                if prediction_col_name.startswith("log_"):
                    predicted_price = np.exp(raw_prediction)
                else:
                    predicted_price = raw_prediction
                prediction_result = float(predicted_price)
                print(f"--- Predicted Price: {prediction_result} ---")
        else:
            print("!!! FATAL Error: Could not find prediction column !!!")

        # --- 3. SMART QUERY FOR SIMILAR CARS (TIERED FALLBACK) ---
        similar_cars_list = []
        if not pd.isna(prediction_result):
            db = SessionLocal()
            try:
                print(f"--- Querying DB for similar cars ---")
                target_body = data.get('body')
                
                # Define base query columns including image_url
                columns = [
                    CarInfo.ID, CarInfo.model, CarInfo.listed_price, CarInfo.myear,
                    CarInfo.fuel, CarInfo.variant, CarInfo.km, CarInfo.state, 
                    CarInfo.body, CarInfo.image_url
                ]
                
                results = []

                # Tier 1: Strict (Body Type + Price Range +/- 30%)
                if target_body:
                    print(f"--- Tier 1: Searching for {target_body} near {prediction_result:.2f} ---")
                    query = db.query(*columns).filter(
                        CarInfo.body == target_body,
                        CarInfo.listed_price >= prediction_result * 0.7,
                        CarInfo.listed_price <= prediction_result * 1.3
                    ).limit(10)
                    results = query.all()

                # Tier 2: Relaxed (Body Type Only)
                if not results and target_body:
                    print(f"--- Tier 2: Relaxed Search (Any {target_body}) ---")
                    query = db.query(*columns).filter(
                        CarInfo.body == target_body
                    ).limit(10)
                    results = query.all()

                # Tier 3: Ultimate Fallback (Any car with Image)
                if not results:
                    print("--- Tier 3: Ultimate Fallback (Any car with image) ---")
                    query = db.query(*columns).filter(
                        CarInfo.image_url != None
                    ).limit(4)
                    results = query.all()

                # Format results
                similar_cars_list = [
                    {
                        "id": c.ID, "model": c.model, "listed_price": c.listed_price,
                        "myear": c.myear, "fuel": c.fuel, "variant": c.variant,
                        "km": c.km, "state": c.state, "body": c.body, 
                        "image_url": c.image_url
                    } 
                    for c in results
                ]
                print(f"--- Found {len(similar_cars_list)} cars to display ---")
                
            except Exception as db_query_error:
                print(f"!!! Database query error finding similar cars: {db_query_error} !!!")
            finally:
                db.close()

        # --- 4. LOG PREDICTION ---
        db = SessionLocal()
        try:
            log_entry_data = {}
            all_input_cols_cleaned = CLEANED_CATEGORICAL_COLS + CLEANED_NUMERICAL_COLS
            for cleaned_col in all_input_cols_cleaned:
                 log_entry_data[f"input_{cleaned_col}"] = data.get(cleaned_col)

            log_entry_data["predicted_price"] = prediction_result if not pd.isna(prediction_result) else None
            valid_keys = {col.name for col in PredictionLog.__table__.columns if col.name not in ['id', 'timestamp']}
            filtered_log_data = {k: v for k, v in log_entry_data.items() if k in valid_keys and v is not None}

            if filtered_log_data:
                log_entry = PredictionLog(**filtered_log_data)
                db.add(log_entry)
                db.commit()
            else:
                print("--- Skipping DB log: No valid data to log ---")
        except Exception as db_error:
            db.rollback()
            print(f"!!! Database logging error: {db_error} !!!")
        finally:
            db.close()

        json_prediction = prediction_result if not pd.isna(prediction_result) else None
        return jsonify({
            "predicted_price": json_prediction,
            "similar_cars": similar_cars_list
        })

    except Exception as e:
        print(f"!!! UNEXPECTED Prediction Error: {e} !!!")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


# --- !! MODIFIED ENDPOINT: Find by Body Type !! ---
@app.route('/find_by_body', methods=['POST'])
def find_by_body():
    """Finds cars of a specific BODY type within a price range."""
    if not SessionLocal: return jsonify({"error": "Database not available"}), 500

    try:
        data = request.get_json()
        if not data: return jsonify({"error": "No input data provided"}), 400

        predicted_price_input = data.get('predicted_price')
        target_body = data.get('body')

        if predicted_price_input is None: return jsonify({"error": "Missing 'predicted_price'"}), 400
        if not target_body: return jsonify({"error": "Missing 'body'"}), 400

        try:
            predicted_price = float(predicted_price_input)
        except (ValueError, TypeError): return jsonify({"error": "Invalid price"}), 400

        price_range = 500000
        lower_bound = max(0, predicted_price - price_range)
        upper_bound = predicted_price + price_range

        db = SessionLocal()
        matching_cars_list = []
        try:
            # UPDATED: Added CarInfo.image_url to selection
            query = db.query(
                CarInfo.ID, CarInfo.model, CarInfo.listed_price, CarInfo.myear,
                CarInfo.variant, CarInfo.km, CarInfo.fuel, CarInfo.state,
                CarInfo.body, CarInfo.transmission, CarInfo.Length, CarInfo.Width,
                CarInfo.image_url 
            ).filter(
                CarInfo.body == target_body,
                CarInfo.listed_price >= lower_bound,
                CarInfo.listed_price <= upper_bound
            ).order_by(
                sql_func.abs(CarInfo.listed_price - predicted_price)
            ).limit(10)

            matching_cars_result = query.all()

            matching_cars_list = [
                {"id": c.ID,
                 "model": c.model,
                 "listed_price": c.listed_price,
                 "myear": c.myear,
                 "variant": c.variant,
                 "km": c.km,
                 "fuel": c.fuel,
                 "state": c.state,
                 "body": c.body,
                 "transmission": c.transmission,
                 "length": c.Length,
                 "width": c.Width,
                 "image_url": c.image_url
                } for c in matching_cars_result
            ]
            print(f"--- Found {len(matching_cars_list)} matching cars in DB ---")

        except Exception as db_query_error:
            print(f"!!! Database query error in /find_by_body: {db_query_error} !!!")
            matching_cars_list = []
        finally:
            db.close()

        return jsonify({"matching_cars": matching_cars_list})

    except Exception as e:
        print(f"!!! UNEXPECTED Error in /find_by_body: {e} !!!")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


# --- OPTIMIZED /cars ENDPOINT ---
@app.route('/cars', methods=['GET'])
def get_cars():
    """ Retrieves DISTINCT values needed for dropdowns efficiently. """
    if not SessionLocal: return jsonify({"error": "Database not initialized"}), 500
    db = SessionLocal()
    try:
        columns_to_fetch = [
            CarInfo.body, CarInfo.transmission, CarInfo.fuel, CarInfo.state,
            CarInfo.utype, CarInfo.Drive_Type, CarInfo.owner_type, CarInfo.Steering_Type
        ]
        options = {}
        key_map = {
            CarInfo.body: 'body_types',
            CarInfo.transmission: 'transmissions',
            CarInfo.fuel: 'fuel_types',
            CarInfo.state: 'states',
            CarInfo.utype: 'utypes',
            CarInfo.Drive_Type: 'drive_types',
            CarInfo.owner_type: 'owner_types',
            CarInfo.Steering_Type: 'steering_types',
        }

        for col in columns_to_fetch:
            frontend_key = key_map.get(col)
            if frontend_key:
                try:
                    query = select(distinct(col)).where(col != None).order_by(col)
                    results = db.execute(query).scalars().all()
                    options[frontend_key] = results
                except Exception as col_error:
                    print(f"!!! Error fetching {frontend_key}: {col_error} !!!")
                    options[frontend_key] = []

        defaults = {
            'drive_types': ['FWD', 'RWD', 'AWD'],
            'owner_types': ['First', 'Second', 'Third', 'Fourth & Above'],
            'steering_types': ['Power', 'Electric', 'Manual'],
            'utypes': ['Used', 'New'],
            'body_types': ['Sedan', 'SUV', 'Hatchback'],
            'transmissions': ['Automatic', 'Manual'],
            'fuel_types': ['Gasoline', 'Diesel', 'Electric'],
            'states': ['DefaultState']
        }
        for k, v in defaults.items():
            if k not in options or not options[k]: options[k] = v

        return jsonify(options)

    except Exception as e:
        print(f"!!! Error fetching options: {e} !!!")
        return jsonify(defaults), 500
    finally:
        db.close()


if __name__ == '__main__':
    if Base and engine:
        try:
            print("--- Table check complete. ---")
        except Exception as e:
            print(f"!!! Error during table check: {e} !!!")
    elif not engine:
        print("!!! Skipping table check - DB engine error. !!!")

    print("--- Starting Flask Development Server... ---")
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)