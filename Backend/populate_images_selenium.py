import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# --- CONFIGURATION ---
DATABASE_URI = os.getenv("DATABASE_URI", "postgresql://postgres:PASSWORD@db.supabase.co:5432/postgres")

engine = create_engine(DATABASE_URI)
Session = sessionmaker(bind=engine)
session = Session()

def populate_images():
    print("--- Starting Selenium Image Scraper ---")
    
    # Setup Chrome
    options = webdriver.ChromeOptions()
    # options.add_argument("--headless") # Keep this commented out to see the browser!
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    try:
        sql = text("SELECT DISTINCT model, myear FROM \"car data\" WHERE image_url IS NULL ORDER BY myear DESC")
        cars = session.execute(sql).fetchall()
        
        for i, row in enumerate(cars):
            model = row[0]
            year = row[1]
            query = f"{year} {model} car exterior side view"
            
            print(f"[{i+1}/{len(cars)}] Searching: {query}")
            
            # Go to Bing Images
            url = f"https://www.bing.com/images/search?q={query.replace(' ', '+')}&first=1"
            driver.get(url)
            
            # Wait for images to load
            time.sleep(2)
            
            try:
                # Find the first image result (class 'mimg' is common for Bing thumbnails)
                img_element = driver.find_element(By.CSS_SELECTOR, "img.mimg")
                src = img_element.get_attribute("src")
                
                if src:
                    print(f"  -> Found image!")
                    # Update DB
                    update_sql = text("UPDATE \"car data\" SET image_url = :url WHERE model = :model AND myear = :year")
                    session.execute(update_sql, {"url": src, "model": model, "year": year})
                    session.commit()
                else:
                    print("  -> No image source found.")
            except Exception as e:
                print(f"  -> Error finding image on page: {e}")
                
    finally:
        driver.quit()
        session.close()

if __name__ == "__main__":
    populate_images()