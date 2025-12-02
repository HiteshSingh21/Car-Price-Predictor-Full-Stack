#  Carify - AI-Powered Luxury Car Valuation Platform

*Carify* is a full-stack machine learning application that provides instant, accurate market valuations for luxury vehicles. Unlike simple regression tools, Carify leverages a state-of-the-art *FT-Transformer (Feature Tokenizer Transformer)* deep learning model to understand complex, non-linear relationships in automotive data.

Beyond just prediction, it features a "Smart Search" engine that recommends similar vehicles currently in the market, complete with images dynamically populated via a custom automated scraping pipeline.

<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/1ecb0eda-1530-4345-8922-ff2c82cd1abc" />
<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/2b9495ab-2c86-4a14-bd9d-bbb87ae48f09" />
<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/416b8bf0-9c0d-4016-a9e6-de217e39fdb5" />


---

##  The Machine Learning Engine: FT-Transformer

The heart of Carify is not a standard Random Forest or Linear Regression model. We utilized *PyTorch Tabular* to implement a deep learning architecture specifically designed for structured data.

### Architecture: Feature Tokenizer + Transformer
Standard neural networks often struggle with tabular data (categorical + numerical mixes). The *FT-Transformer* solves this by treating features like words in a sentence:

1.  *Feature Tokenization:* - Categorical inputs (e.g., Fuel: Diesel, Body: SUV) and numerical inputs (e.g., Year: 2020) are projected into a high-dimensional embedding space.
2.  *Transformer Encoder:* - A stack of Multi-Head Self-Attention layers processes these embeddings, allowing the model to learn complex interactions (e.g., identifying that "Manual Transmission" lowers value for a "Mercedes" but might raise it for a "Porsche").
3.  *Log-Space Prediction:* - The model predicts price in log-space to handle the massive variance in luxury car prices (from ₹5L to ₹5Cr) and reduce the impact of outliers.

---

##  Key Features

###  Modern Frontend
* *Framework:* Built with *Next.js 15* and *React 19* for server-side rendering and speed.
* *UI/UX:* Styled with *Tailwind CSS* and *Shadcn/UI* components for a premium, dark-mode aesthetic.
* *Interactive 3D:* Dynamically loaded 3D car visualizations.
* *Real-time Validation:* Robust form handling using *Zod* and *React Hook Form*.

###  Powerful Backend
* *API:* High-performance *Flask* server acting as the inference engine.
* *Smart Search Algorithm:* A 3-tier fallback system to ensure users always get results:
    1.  Strict: Matches exact Body Type within a ±30% price range.
    2.  Relaxed: Falls back to matching Body Type if no exact price match exists.
    3.  Ultimate Fallback: Displays featured inventory if specific criteria aren't met.
* *Robust Database:* *SQLAlchemy* with connection pooling (pool_pre_ping, pool_recycle) to maintain stable connections to Supabase, even during idle periods.

###  Automation & Data
* *Database:* Hosted *PostgreSQL* on Supabase.
* *Auto-Image Population:* Includes a custom Python script (populate_images_wiki.py) that:
    1.  Scans the database for cars missing images.
    2.  Queries the *Wikipedia API* to find high-quality, royalty-free images.
    3.  Automatically updates database records.

---

##  Technology Stack

| Component | Technology |
| :--- | :--- |
| *Frontend* | Next.js 15, React 19, TypeScript, Tailwind CSS, Bun |
| *UI Library* | Shadcn/UI, Lucide React, Framer Motion |
| *Backend* | Python 3.10+, Flask, SQLAlchemy |
| *Database* | PostgreSQL (Supabase), psycopg2 |
| *ML Core* | PyTorch, PyTorch Tabular, Pandas, NumPy |
| *Utilities* | Wikipedia API, Omegaconf |

---

##  Getting Started

### Prerequisites
* *Node.js* & *Bun* installed.
* *Python 3.10+* installed.
* A *Supabase* PostgreSQL database URL.

### 1. Installation

Clone the repository:
bash
git clone [https://github.com/your-username/carify-valuation.git](https://github.com/your-username/carify-valuation.git)
cd carify-valuation
`

### 2\. Backend Setup

Navigate to the backend directory:

bash
cd Backend


Create a virtual environment and install dependencies:

bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate

# Install libraries
pip install -r requirements.txt


*Configuration:*
Open app.py (or create a .env file) and add your database connection string:

python
DATABASE_URI = "postgresql://user:password@your-supabase-db-url:5432/postgres"


Run the server:

bash
python app.py


### 3\. Frontend Setup

Open a new terminal, navigate to the frontend directory:

bash
cd Frontend


Install dependencies and run the development server:

bash
bun install
bun dev


Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) to see the app live\!

-----

##  Populating Car Images

If your database has car data but no images, run the included utility script:

bash
cd Backend
python populate_images_wiki.py


*This script intelligently searches Wikipedia for every car model in your database and updates the image_url column automatically.*

-----

##  Future Roadmap

  * [ ] *User Authentication:* Save valuation history and favorite cars.
  * [ ] *Full Browse Catalog:* A dedicated page with advanced filters to explore the entire dataset.
  * [ ] *Generative AI Integration:* Integrating a Text-to-Video model to generate custom car modification previews.

-----

##  License

This project is licensed under the MIT License.

```
```
