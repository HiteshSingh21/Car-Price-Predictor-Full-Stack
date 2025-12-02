import time
import random
import requests
import json
from bs4 import BeautifulSoup
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# --- CONFIGURATION ---
DATABASE_URI = os.getenv("DATABASE_URI", "postgresql://postgres:PASSWORD@db.supabase.co:5432/postgres")

# Setup DB Connection
engine = create_engine(DATABASE_URI)
Session = sessionmaker(bind=engine)
session = Session()

def get_car_image_bing(query):
    """
    Searches Bing Images using BeautifulSoup to parse the 'm' attribute 
    found in the 'iusc' class, which contains the image URL.
    """
    # Simpler query to ensure results
    search_url = f"https://www.bing.com/images/search?q={query}&first=1"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5"
    }

    try:
        response = requests.get(search_url, headers=headers, timeout=10)
        
        # 1. Check for bot block
        if "Verify you are human" in response.text or "challenge" in response.text.lower():
            print("  ⚠️  Bing detected a bot. Waiting 60s...")
            time.sleep(60)
            return None

        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 2. Find the first image container (class 'iusc')
        # This element contains the metadata in a JSON string inside the 'm' attribute
        image_element = soup.find("a", {"class": "iusc"})
        
        if image_element and image_element.has_attr("m"):
            # Parse the JSON string
            metadata = json.loads(image_element["m"])
            return metadata.get("murl") # 'murl' is the direct image URL
            
    except Exception as e:
        print(f"  Error parsing Bing: {e}")
        
    return None

def populate_images():
    print("--- Starting Image Population (BS4 Method) ---")
    
    sql = text("""
        SELECT DISTINCT model, myear 
        FROM "car data" 
        WHERE image_url IS NULL 
        ORDER BY myear DESC
    """)
    
    cars_to_update = session.execute(sql).fetchall()
    total_cars = len(cars_to_update)
    print(f"Found {total_cars} models to update.")
    
    count = 0
    for row in cars_to_update:
        model_name = row[0]
        year = row[1]
        
        # Simplified query for better hit rate
        search_query = f"{year} {model_name} car"
        
        print(f"[{count + 1}/{total_cars}] Searching: {search_query}...")
        
        image_url = get_car_image_bing(search_query)
        
        if image_url:
            print(f"  -> Found: {image_url[:40]}...")
            
            update_sql = text("""
                UPDATE "car data" 
                SET image_url = :url 
                WHERE model = :model AND myear = :year AND image_url IS NULL
            """)
            
            try:
                session.execute(update_sql, {"url": image_url, "model": model_name, "year": year})
                session.commit()
            except Exception as e:
                session.rollback()
                print(f"  -> DB Error: {e}")
        else:
            print("  -> No image found (or blocked).")
            
        count += 1
        # Random delay to look human
        time.sleep(random.uniform(2.0, 5.0))

    print("--- Done! ---")

if __name__ == "__main__":
    try:
        populate_images()
    finally:
        session.close()