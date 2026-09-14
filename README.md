# Ivy Homes Property Intelligence Dashboard
🔗 **Live Application:**  
https://laihtbzdrzinag3zlc2fm7.streamlit.app/
A property discovery and analytics dashboard developed as part of the Ivy Homes internship assignment.

The project focuses on transforming raw property datasets into a user-friendly platform where users can explore property listings, rental buildings, residential projects, save favourite properties, and view useful property-level insights.

---

## 1. Problem Statement

Real-estate property data is often large, inconsistent, and difficult to explore directly through raw JSON or CSV files.

The main challenges identified in this assignment were:

- Large property datasets containing thousands of records
- Difficulty searching and filtering relevant properties
- Need to distinguish active and inactive listings
- Need to explore rental buildings and residential projects separately
- Lack of a simple interface for viewing property details
- Need to save favourite listings for later reference
- Data-quality issues such as invalid prices, inconsistent fields, and suspicious records
- Need to calculate business insights from the available datasets

The objective was to build a property intelligence dashboard that solves these problems through an interactive and structured interface.

---

## 2. Project Objective

The objective of this project was to create a complete property discovery dashboard with the following capabilities:

- Explore property listings
- Search properties using multiple fields
- Filter properties by property type
- Navigate through paginated records
- View detailed information about a property
- Save and remove favourite listings
- Explore rental buildings
- Explore residential projects
- Display high-level property insights
- Analyse data quality issues
- Provide assignment answers in a structured `submission.json` file

---

## 3. Solution Approach

The project was implemented in the following stages:

### Step 1: Data Collection

The provided API and dataset resources were studied to understand:

- Available endpoints
- Listing fields
- Rental fields
- Project fields
- Authentication requirements
- Pagination structure
- Data relationships

The available datasets were downloaded and stored locally for analysis and frontend usage.

The collected data contained approximately:

- 4,203 property listings
- 1,576 rental records
- 449 project records

---

### Step 2: Data Understanding and Cleaning

The datasets were analysed using Python to understand their structure and identify data-quality problems.

The analysis included:

- Total number of records
- Unique property identification
- Active and inactive listings
- Missing values
- Invalid numeric values
- Negative or unrealistic prices
- Invalid bedroom and bathroom values
- Floor number inconsistencies
- Suspicious listing descriptions
- Project listing-count mismatches
- Recently posted listings
- Duplicate or suspicious listing IDs

This analysis helped in preparing the answers required in `submission.json`.

---

### Step 3: Frontend Development

A responsive frontend dashboard was developed using React and Vite.

The dashboard contains separate pages for:

- Login
- Property Listings
- Listing Details
- Saved Listings
- Rental Buildings
- Projects
- Insights

React Router was used for page navigation and route management.

---

### Step 4: Search, Filtering and Pagination

A client-side search system was implemented to allow users to search across multiple listing fields, including:

- Apartment name
- Locality
- City
- Property type
- Listing ID
- Other available property attributes

Property-type filtering was added to make the listing discovery process easier.

Pagination was implemented to avoid displaying thousands of records on a single page.

---

### Step 5: Listing Details and Saved Listings

A separate listing-detail page was implemented for viewing complete information about an individual property.

The detail page displays relevant information such as:

- Apartment or property name
- Locality
- Property type
- Bedrooms
- Bathrooms
- Floor information
- Furnishing
- Parking
- Price
- Carpet area
- Description
- Verification status

A saved-listing feature was implemented using browser `localStorage`.

This allows users to:

- Save a listing
- Remove a saved listing
- Persist saved listings after refreshing the browser

---

### Step 6: Rentals and Projects Modules

Separate modules were created for rental buildings and residential projects.

The rentals module supports:

- Rental record exploration
- Search functionality
- Structured rental data display

The projects module supports:

- Project discovery
- Project search
- Developer and location information
- Project-level listing information

---

### Step 7: Insights Dashboard

An insights dashboard was created to display useful summary statistics such as:

- Total listings
- Total rentals
- Total projects
- Active listings
- Verified listings
- Average property price
- Minimum property price
- Maximum property price

These metrics provide a quick overview of the available property inventory.

---

## 4. Key Features

### Authentication and Session Handling

- Login interface
- Session state management
- Logout functionality
- Protected dashboard navigation

### Property Listings

- Display property records
- Search across multiple fields
- Property-type filtering
- Pagination
- Listing count display

### Listing Details

- Detailed property information
- Individual listing route
- Navigation from listing card to detail page

### Saved Listings

- Save favourite properties
- Remove saved properties
- Persistent storage using `localStorage`

### Rentals

- Dedicated rental buildings page
- Searchable rental inventory
- Structured data presentation

### Projects

- Dedicated residential projects page
- Project search
- Project-level information

### Insights

- Summary metrics
- Inventory statistics
- Price statistics
- Data overview

### Data Quality Analysis

- Invalid record detection
- Suspicious listing identification
- Project-count validation
- Business-level data checks

---

## 5. Technology Stack

### Frontend

- **React**  
  Used to build reusable UI components and interactive pages.

- **Vite**  
  Used as the frontend build tool and development server.

- **JavaScript**  
  Used for application logic, filtering, state management, and API/data handling.

- **React Router**  
  Used for client-side routing between login, listings, details, rentals, projects, saved listings, and insights pages.

- **CSS**  
  Used to create the dashboard layout, cards, navigation, tables, buttons, and responsive styling.

### Data Analysis

- **Python**  
  Used for data downloading, preprocessing, validation, and analysis.

- **Pandas**  
  Used for reading, cleaning, analysing, and aggregating property datasets.

- **JSON**  
  Used as the data format for storing listings, rentals, and project records.

### Browser Storage

- **LocalStorage**  
  Used for saving favourite listing IDs and maintaining basic session-related information in the browser.

### API and Data Layer

- **REST API**  
  Used for understanding and integrating the provided property data services.

- **Environment Variables**  
  Used for keeping API configuration separate from application code.

---

## 6. Project Structure

```text
ivy-homes-assignment/
│
├── app.py
├── submission.json
├── README.md
├── requirements.txt
├── .gitignore
│
├── data/
│   ├── listings.json
│   ├── rentals.json
│   └── projects.json
│
├── analysis/
│   ├── download_data.py
│   ├── analyze_data.py
│   └── other analysis files
│
└── frontend/
    ├── package.json
    ├── package-lock.json
    ├── index.html
    │
    ├── public/
    │   └── data/
    │       ├── listings.json
    │       ├── rentals.json
    │       └── projects.json
    │
    └── src/
        ├── components/
        │   ├── ProjectRoutes.jsx
        │   ├── ProtectedRoute.jsx
        │   └── LogoutButton.jsx
        │
        ├── pages/
        │   ├── Login.jsx
        │   ├── Listings.jsx
        │   ├── ListingDetail.jsx
        │   ├── SavedListings.jsx
        │   ├── Rentals.jsx
        │   ├── Projects.jsx
        │   └── Insights.jsx
        │
        ├── services/
        │   └── api.js
        │
        ├── App.jsx
        └── App.css
- `README.md` - Documentation

## Run Frontend

```bash
cd frontend
npm install
npm run dev
