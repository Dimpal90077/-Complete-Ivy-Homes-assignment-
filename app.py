import json
from pathlib import Path

import pandas as pd
import streamlit as st


st.set_page_config(
    page_title="Ivy Homes Dashboard",
    page_icon="🏠",
    layout="wide"
)


BASE_DIR = Path(__file__).parent


def load_json(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)


def load_data():
    listings_path = BASE_DIR / "data" / "listings.json"
    rentals_path = BASE_DIR / "data" / "rentals.json"
    projects_path = BASE_DIR / "data" / "projects.json"

    listings = load_json(listings_path)
    rentals = load_json(rentals_path)
    projects = load_json(projects_path)

    return (
        pd.DataFrame(listings),
        pd.DataFrame(rentals),
        pd.DataFrame(projects)
    )


@st.cache_data
def get_data():
    return load_data()


listings_df, rentals_df, projects_df = get_data()


# Sidebar
st.sidebar.title("🏠 Ivy Homes")
st.sidebar.caption("Property Intelligence Dashboard")

page = st.sidebar.radio(
    "Navigate",
    [
        "Dashboard",
        "Listings",
        "Rental Buildings",
        "Projects",
        "Insights"
    ]
)


# Dashboard
if page == "Dashboard":
    st.title("🏠 Ivy Homes Property Dashboard")
    st.write("Explore property listings, rental buildings, projects and insights.")

    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.metric("Total Listings", len(listings_df))

    with col2:
        st.metric("Total Rentals", len(rentals_df))

    with col3:
        st.metric("Total Projects", len(projects_df))

    with col4:
        if "is_live" in listings_df.columns:
            active_count = listings_df["is_live"].astype(str).str.lower().eq("true").sum()
        else:
            active_count = 0

        st.metric("Active Listings", int(active_count))

    st.subheader("Recent Listings")
    st.dataframe(
        listings_df.head(10),
        use_container_width=True
    )


# Listings
elif page == "Listings":
    st.title("Property Listings")

    search = st.text_input(
        "Search by apartment, locality, city, property type or listing ID"
    )

    property_types = ["All"]

    if "property_type" in listings_df.columns:
        property_types += sorted(
            listings_df["property_type"]
            .dropna()
            .astype(str)
            .unique()
            .tolist()
        )

    selected_type = st.selectbox(
        "Property Type",
        property_types
    )

    filtered_df = listings_df.copy()

    if search:
        search_text = search.lower().strip()

        filtered_df = filtered_df[
            filtered_df.astype(str)
            .apply(
                lambda row: row.str.lower().str.contains(
                    search_text,
                    na=False
                ).any(),
                axis=1
            )
        ]

    if selected_type != "All" and "property_type" in filtered_df.columns:
        filtered_df = filtered_df[
            filtered_df["property_type"].astype(str) == selected_type
        ]

    st.write(f"Showing {len(filtered_df)} listings")

    st.dataframe(
        filtered_df,
        use_container_width=True,
        height=600
    )


# Rentals
elif page == "Rental Buildings":
    st.title("Rental Buildings")

    search = st.text_input(
        "Search rental buildings",
        key="rental_search"
    )

    filtered_rentals = rentals_df.copy()

    if search:
        search_text = search.lower().strip()

        filtered_rentals = filtered_rentals[
            filtered_rentals.astype(str)
            .apply(
                lambda row: row.str.lower().str.contains(
                    search_text,
                    na=False
                ).any(),
                axis=1
            )
        ]

    st.write(f"Showing {len(filtered_rentals)} rental records")

    st.dataframe(
        filtered_rentals,
        use_container_width=True,
        height=600
    )


# Projects
elif page == "Projects":
    st.title("Residential Projects")

    search = st.text_input(
        "Search projects",
        key="project_search"
    )

    filtered_projects = projects_df.copy()

    if search:
        search_text = search.lower().strip()

        filtered_projects = filtered_projects[
            filtered_projects.astype(str)
            .apply(
                lambda row: row.str.lower().str.contains(
                    search_text,
                    na=False
                ).any(),
                axis=1
            )
        ]

    st.write(f"Showing {len(filtered_projects)} projects")

    st.dataframe(
        filtered_projects,
        use_container_width=True,
        height=600
    )


# Insights
elif page == "Insights":
    st.title("Property Insights")

    col1, col2, col3 = st.columns(3)

    with col1:
        st.metric("Listings", len(listings_df))

    with col2:
        st.metric("Rentals", len(rentals_df))

    with col3:
        st.metric("Projects", len(projects_df))

    st.subheader("Listing Statistics")

    if "price" in listings_df.columns:
        price_series = pd.to_numeric(
            listings_df["price"],
            errors="coerce"
        )

        col1, col2, col3 = st.columns(3)

        with col1:
            st.metric(
                "Average Price",
                f"₹{price_series.mean():,.0f}"
            )

        with col2:
            st.metric(
                "Minimum Price",
                f"₹{price_series.min():,.0f}"
            )

        with col3:
            st.metric(
                "Maximum Price",
                f"₹{price_series.max():,.0f}"
            )

        st.subheader("Price Distribution")
        st.bar_chart(
            price_series.dropna().head(100)
        )

    st.subheader("Data Preview")
    st.dataframe(
        listings_df.describe(include="all").transpose(),
        use_container_width=True
    )