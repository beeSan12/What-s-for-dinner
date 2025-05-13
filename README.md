# Whats-For-Dinner

An interactive web application that helps you explore sustainability, discover recipes, and visualize environmental and nutritional data and for 20 000 food products from Open Food Facts. Filter by eco-score, inspect calorie vs. eco-score, view average nutrition, and see where products originate on a world map.

## Project Description

What's For Dinner is a full-stack application that lets users search a database of food products, inspect detailed nutrition and allergen information, filter by eco-score and allergens and discover AI-generated recipes based on selected ingredients. The backend, built with Node.js, Express, and MongoDB, fetches product data from Open Food Facts (licensed under the ODbL) and enriches it with environmental scores, embeddings, and recipe generation via OpenAI. The React frontend provides a responsive, interactive interface with charts, maps, and dynamic search.

**Key insights and features:** lets users:

- **Product Search:** Fuzzy search with pagination, caching, and custom product additions.

- **Nutrition & Allergens:** Detailed per-100g nutrition charts and allergen breakdowns.

- **Eco-Score Visualizations:** Bar charts, scatter plots, and world map showing product origins and environmental impact.

- **Recipe Generation:** Embedding-based similarity search and AI-suggested recipes from selected products.

- **Free-text Q&A:** Ask the Chef Guru any food-related question and get curated answers.

**Whats-For-Dinner** lets users:

- Browse **eco-score distributions** (grades A–E) and drill in with checkboxes.
- Explore a **scatter plot** of eco-score vs. calories per 100 g.
- Toggle a **radar chart** showing average macro‐ and micronutrient values.
- View an **interactive world map** with pie‐charts on each country showing how many products (and their eco-grades) come from that region.

Data comes from Open Food Facts (20 000 records), processed and served by a Node.js/Express backend with MongoDB. The dataset is based on data from Open Food Facts and is used in accordance with the terms of the Open Database License (ODbL). Visualizations are built in React using ECharts.  

## Core Technologies

- **Backend**: Node.js + Express, InversifyJS for Dependency Injection, Docker, **Mongoose** for MongoDB, aggregation pipelines for distribution & origin data.
- **API**: API: OpenAI API for embeddings and chat completions, Open Food Facts API.  
- **Database**: MongoDB (20 000 products, plus vector embeddings for future RAG enhancements)  
- **Data Processing**: JavaScript (seed script parses CSV, extracts nutrition & allergens).  
- **Auth & Security**: JWT-based authentication, Helmet, rate limiting, CORS.

- **Frontend**: React, TypeScript, React Router, Context API for auth, recharts & ChartJS & ECharts for data visualization.
- **Deployment**: Docker Compose orchestration for MongoDB, backend, and frontend services.

## How to Use

1. **Search Products:**  
  Enter a product name, apply eco-score/allergen filters, and browse results with pagination.

2. **View Details:**  
  Click a product to view nutrition facts, ingredient lists, brand and categories, plus interactive charts.

3. **Find Recipes:**
  AI generates step-by-step recipes in English, tailored to your ingredients.

4. **Ask Questions:**
  Switch to the Chef Guru tab to ask free-text questions like "Which chocolate is dairy free?".

5. **Filter by eco-grade**  
   Use the A–E checkboxes to include/exclude grades in all charts.  

6. **Eco-score scatter**  
   Hover over points to see product name, eco-score and kcal/100g.  

7. **Nutrition radar**  
   Click **Show radar** to overlay the average nutrition profile across your filtered products.

8. **Origin map**  
   Pan/zoom the world map; each country shows a mini pie chart of counts by eco-grade.  

## Link to the Deployed Application

- [Link to application](https://cscloud6-136.lnu.se/wt2)

## Additional features

- **Custom Products**
  Add your own products if not found in the global database.

- **Caching**
  Nutrition, allergen, and ingredient data cached in localStorage for faster subsequent loads.

- **Error Handling**
  User-friendly alerts and fallback AI responses when data is missing.

- **Responsive UI**
  Mobile-friendly layout with image lightboxes and modal overlays.

- **Aggregation pipelines** on the backend for:
  - Fast eco-score distribution over all 20 000 docs (no paging limits)
  - “Origin map” that groups by country code and eco-grade
- **Lazy-loaded** charts (`React.Suspense`) to speed up initial render
- **Responsive** layout via CSS grid and ECharts’ `resize()` hook  
- **Seed scripts** to import CSV, extract nutrition, detect allergens (via regex + OpenFoodFacts API), and batch‐create OpenAI embeddings  

Explain how you have addressed the assignment requirements. If you've added any custom functionality, discuss them in this section and link to the specific issues you have closed.

## Acknowledgements

- [Open Food Facts](https://world.openfoodfacts.org/) dataset under ODbL  
- [ECharts](https://echarts.apache.org/) for powerful, interactive charts  
- [MongoDB](https://www.mongodb.com/) & Mongoose for flexible, JSON-style storage  
- [OpenAI] for embeddings and chat APIs
- [React community, ECharts, ChartJS] and various open-source libraries
