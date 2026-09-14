import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { getListings } from "../services/api";

function Listings() {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [savedListings, setSavedListings] = useState(() => {
    const saved = localStorage.getItem("savedListings");
    return saved ? JSON.parse(saved) : [];
  });

  const listingsPerPage = 12;

  // Load real listings.json
  useEffect(() => {
    async function fetchListings() {
      try {
        setLoading(true);

        const response = await fetch("/data/listings.json");

        if (!response.ok) {
          throw new Error("Unable to load listings data");
        }

        const data = await response.json();

        setListings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, []);

  // Save favourites persistently
  useEffect(() => {
    localStorage.setItem(
      "savedListings",
      JSON.stringify(savedListings)
    );
  }, [savedListings]);

  // Unique property types
  const propertyTypes = useMemo(() => {
    const types = listings
      .map((item) => item.property_type)
      .filter(Boolean);

    return ["All", ...new Set(types)];
  }, [listings]);

  // Filter listings
const filteredListings = useMemo(() => {
  const searchText = search.trim().toLowerCase();

  return listings.filter((listing) => {
    // Search across all listing fields
    const searchableText = Object.values(listing)
      .map((value) => String(value ?? "").toLowerCase())
      .join(" ");

    const matchesSearch =
      searchText === "" ||
      searchableText.includes(searchText);

    const matchesType =
      propertyType === "All" ||
      String(listing.property_type || "").toLowerCase() ===
        propertyType.toLowerCase();

    return matchesSearch && matchesType;
  });
}, [listings, search, propertyType]);

  // Pagination
  const totalPages = Math.ceil(
    filteredListings.length / listingsPerPage
  );

  const startIndex = (currentPage - 1) * listingsPerPage;

  const currentListings = filteredListings.slice(
    startIndex,
    startIndex + listingsPerPage
  );

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setCurrentPage(1);
  }

  function handleTypeChange(event) {
    setPropertyType(event.target.value);
    setCurrentPage(1);
  }

  function toggleSave(listingId) {
    setSavedListings((previous) => {
      if (previous.includes(listingId)) {
        return previous.filter((id) => id !== listingId);
      }

      return [...previous, listingId];
    });
  }

  function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");

    navigate("/login");
  }

  function formatPrice(price) {
    if (!price || price <= 0) {
      return "Price unavailable";
    }

    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }

    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }

    return `₹${price.toLocaleString("en-IN")}`;
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <h2>Loading Ivy Homes listings...</h2>
        <p>Fetching real property data</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-screen">
        <h2>Failed to load listings</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">I</div>
          <div>
            <h2>Ivy Homes</h2>
            <span>Property Intelligence</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">
            <span>▦</span>
            Listings
          </button>

          <button
            className="nav-item"
            onClick={() => alert("Saved listings module coming next")}
          >
            <span>♡</span>
            Saved
          </button>

          <button
            className="nav-item"
            onClick={() => alert("Insights module coming next")}
          >
            <span>◈</span>
            Insights
          </button>

          <button
            className="nav-item"
            onClick={() => alert("Projects module coming next")}
          >
            <span>⌂</span>
            Projects
          </button>
        </nav>

        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="top-header">
          <div>
            <p className="eyebrow">PROPERTY EXPLORER</p>
            <h1>Listings Dashboard</h1>
            <p className="header-subtitle">
              Explore verified property listings across locations.
            </p>
          </div>

          <div className="user-info">
            <div className="user-avatar">DS</div>
            <div>
              <strong>
                {localStorage.getItem("userEmail") || "Demo User"}
              </strong>
              <small>Analyst</small>
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="stats-grid">
          <div className="stat-card">
            <span>Total Listings</span>
            <strong>{listings.length.toLocaleString()}</strong>
            <small>From complete dataset</small>
          </div>

          <div className="stat-card">
            <span>Live Listings</span>
            <strong>
              {listings
                .filter((item) => item.is_live === true)
                .length.toLocaleString()}
            </strong>
            <small>Currently active</small>
          </div>

          <div className="stat-card">
            <span>Saved Properties</span>
            <strong>{savedListings.length}</strong>
            <small>Your favourites</small>
          </div>

          <div className="stat-card">
            <span>Filtered Results</span>
            <strong>{filteredListings.length.toLocaleString()}</strong>
            <small>Matching current filters</small>
          </div>
        </section>

        {/* Filters */}
        <section className="filter-section">
          <div className="search-wrapper">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search by apartment, locality or listing ID..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>

          <select
            value={propertyType}
            onChange={handleTypeChange}
            className="type-select"
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <button
            className="clear-button"
            onClick={() => {
              setSearch("");
              setPropertyType("All");
              setCurrentPage(1);
            }}
          >
            Clear
          </button>
        </section>

        {/* Result heading */}
        <div className="results-header">
          <div>
            <h2>Property Listings</h2>
            <p>
              Showing {currentListings.length} of{" "}
              {filteredListings.length.toLocaleString()} results
            </p>
          </div>

          <span className="dataset-badge">
            Live Dataset
          </span>
        </div>

        {/* Cards */}
        <section className="listing-grid">
          {currentListings.map((listing) => {
            const isSaved = savedListings.includes(
              listing.listing_id
            );

            return (
              <article
                className="listing-card"
                key={listing.listing_id}
              >
                <div className="listing-card-top">
                  <span className="property-badge">
                    {listing.property_type || "Property"}
                  </span>

                  <button
                    className={`save-button ${
                      isSaved ? "saved" : ""
                    }`}
                    onClick={() =>
                      toggleSave(listing.listing_id)
                    }
                  >
                    {isSaved ? "♥" : "♡"}
                  </button>
                </div>

                <div className="property-image-placeholder">
                  <span>⌂</span>
                </div>

                <div className="listing-card-body">
                  <h3>
                    {listing.apartment_name ||
                      "Unnamed Property"}
                  </h3>

                  <p className="locality">
                    {listing.locality || "Location unavailable"}
                  </p>

                  <div className="property-details">
                    <span>
                      🛏 {listing.bedroom ?? "N/A"} BHK
                    </span>
                    <span>
                      ◇ {listing.bathroom ?? "N/A"} Bath
                    </span>
                    <span>
                      ▣ {listing.carpet_area ?? "N/A"} sq.ft
                    </span>
                  </div>

                  <div className="listing-footer">
                    <div>
                      <small>Price</small>
                      <strong>
                        {formatPrice(listing.price)}
                      </strong>
                    </div>

                    <button
                      className="view-button"
                      onClick={() => navigate(`/listings/${listing.listing_id}`)}
                    >
                    View Details
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {currentListings.length === 0 && (
          <div className="empty-state">
            <h3>No listings found</h3>
            <p>Try changing your search or filters.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((page) => page - 1)
              }
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => page + 1)
              }
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Listings;