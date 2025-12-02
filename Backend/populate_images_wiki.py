import time
import wikipedia
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# --- CONFIGURATION ---
# Paste your actual Supabase URI here
DATABASE_URI = os.getenv("DATABASE_URI", "postgresql://postgres:PASSWORD@db.supabase.co:5432/postgres")

# Setup DB Connection
engine = create_engine(DATABASE_URI)
Session = sessionmaker(bind=engine)
session = Session()

def get_wiki_image(query):
    try:
        # 1. Search Wikipedia for the car model (e.g., "Maruti Swift")
        # We append " car" to avoid ambiguity (e.g. "Swift" the bird)
        search_results = wikipedia.search(query + " car")
        
        if not search_results:
            return None
            
        # 2. Get the page for the first result
        # auto_suggest=False prevents it from jumping to random pages
        page = wikipedia.page(search_results[0], auto_suggest=False)
        
        # 3. Look for the main image
        # Wikipedia pages usually have images. We look for valid image files.
        for img_url in page.images:
            lower_url = img_url.lower()
            # Filter out SVGs, logos, and icons
            if lower_url.endswith(('.jpg', '.jpeg', '.png')) and 'logo' not in lower_url and 'icon' not in lower_url:
                return img_url
                
    except Exception as e:
        print(f"  Error fetching {query}: {e}")
        return None
    
    return None

def populate_images():
    print("--- Starting Wikipedia Image Population ---")
    
    # Get list of models that currently have NO image
    sql = text("""
        SELECT DISTINCT model 
        FROM "car data" 
        WHERE image_url IS NULL
    """)
    
    cars_to_update = session.execute(sql).fetchall()
    total_cars = len(cars_to_update)
    print(f"Found {total_cars} unique models to find images for.")
    
    count = 0
    for row in cars_to_update:
        model_name = row[0]
        
        print(f"[{count+1}/{total_cars}] Searching Wikipedia for: {model_name}...")
        
        image_url = get_wiki_image(model_name)
        
        if image_url:
            print(f"  -> Found: {image_url[:60]}...")
            
            # Update ALL cars of this model in the database
            update_sql = text("""
                UPDATE "car data" 
                SET image_url = :url 
                WHERE model = :model AND image_url IS NULL
            """)
            
            try:
                session.execute(update_sql, {"url": image_url, "model": model_name})
                session.commit()
                print("  -> Database updated.")
            except Exception as e:
                session.rollback()
                print(f"  -> DB Error: {e}")
        else:
            print("  -> No image found on Wikipedia.")
            
        count += 1
        # Be polite to Wikipedia API
        time.sleep(1)

    print("--- Done! ---")

if __name__ == "__main__":
    try:
        populate_images()
    finally:
        session.close()