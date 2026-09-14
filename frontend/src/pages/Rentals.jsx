import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Rentals() {
  const navigate = useNavigate();

  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [furnishing, setFurnishing] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const rentalsPerPage = 12;

  useEffect(() => {
    async function fetchRentals() {
      try {
        const response = await fetch("/data/rentals.json");

        if (!response.ok) {
          throw new Error("Unable to load rentals data");
        }

        const data = await response.json();
        setRentals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRentals();
  }, []);

  const furnishingTypes = useMemo(() => {
    const types = rentals
      .map((item) => item.furnishing)
      .filter(Boolean);

    return ["All", ...new Set(types)];
  }, [rentals]);

  const filteredRentals = useMemo(() => {
    const searchText = search.toLowerCase();

    return rentals.filter((rental) => {
      const matchesSearch =
        String(rental.title || "")
          .toLowerCase()
          .includes(searchText) ||
        String(rental.apartment_name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(rental.locality || "")
          .toLowerCase()
          .includes(searchText) ||
        String(rental.listing_id || "")
          .toLowerCase()
          .includes(searchText);

      const matchesFurnishing =
        furnishing === "All" ||
        rental.furnishing === furnishing;

      return matchesSearch && matchesFurnishing;
    });
  }, [rentals, search, furnishing]);

  const totalPages = Math.ceil(
    filteredRentals.length / rentalsPerPage
  );

  const startIndex = (currentPage - 1) * rentalsPerPage;

  const currentRentals = filteredRentals.slice(
    startIndex,
    startIndex + rentalsPerPage
  );

  function formatRent(price) {
    if (!price || price <= 0) {
      return "Rent unavailable";
    }

    return `₹${price.toLocaleString("en-IN")}/month`;
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <h2>Loading rental properties...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-screen">
        <h2>Failed to load rentals</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">I</div>

          <div>
            <h2>Ivy Homes</h2>
            <span>Property Intelligence</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className="nav-item"
            onClick={() => navigate("/listings")}
          >
            <span>▦</span>
            Listings
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/saved")}
          >
            <span>♡</span>
            Saved
          </button>

          <button
            className="nav-item active"
          >
            <span>⌂</span>
            Rentals
          </button>

          <button
            className="nav-item"
            onClick={() => alert("Projects module coming next")}
          >
            <span>▤</span>
            Projects
          </button>

          <button
            className="nav-item"
            onClick={() => alert("Insights module coming next")}
          >
            <span>◈</span>
            Insights
          </button>
        </nav>

        <button
          className="logout-button"
          onClick={() => navigate("/login")}
        >
          Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div>
            <p className="eyebrow">RENTAL EXPLORER</p>
            <h1>Rental Properties</h1>
            <p className="header-subtitle">
              Explore rental properties and monthly rental prices.
            </p>
          </div>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <span>Total Rentals</span>
            <strong>{rentals.length.toLocaleString()}</strong>
            <small>Complete rental dataset</small>
          </div>

          <div className="stat-card">
            <span>Live Rentals</span>
            <strong>
              {rentals
                .filter((item) => item.is_live === true)
                .length.toLocaleString()}
            </strong>
            <small>Currently active</small>
          </div>

          <div className="stat-card">
            <span>Average Rent</span>
            <strong>
              ₹
              {Math.round(
                rentals
                  .filter((item) => item.price > 0)
                  .reduce(
                    (sum, item) => sum + item.price,
                    0
                  ) /
                  rentals.filter((item) => item.price > 0)
                    .length
              ).toLocaleString("en-IN")}
            </strong>
            <small>Per month</small>
          </div>

          <div className="stat-card">
            <span>Filtered Results</span>
            <strong>
              {filteredRentals.length.toLocaleString()}
            </strong>
            <small>Matching filters</small>
          </div>
        </section>

        <section className="filter-section">
          <div className="search-wrapper">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search rental, locality or listing ID..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <select
            className="type-select"
            value={furnishing}
            onChange={(event) => {
              setFurnishing(event.target.value);
              setCurrentPage(1);
            }}
          >
            {furnishingTypes.map((type) => (
              <option key={type} value={type}>
                {type || "Unknown"}
              </option>
            ))}
          </select>

          <button
            className="clear-button"
            onClick={() => {
              setSearch("");
              setFurnishing("All");
              setCurrentPage(1);
            }}
          >
            Clear
          </button>
        </section>

        <div className="results-header">
          <div>
            <h2>Available Rentals</h2>
            <p>
              Showing {currentRentals.length} of{" "}
              {filteredRentals.length.toLocaleString()} rentals
            </p>
          </div>

          <span className="dataset-badge">
            Rental Dataset
          </span>
        </div>

        <section className="listing-grid">
          {currentRentals.map((rental) => (
            <article
              className="listing-card"
              key={rental.listing_id}
            >
              <div className="listing-card-top">
                <span className="property-badge">
                  {rental.property_type || "Rental"}
                </span>
              </div>

              <div className="property-image-placeholder">
                <span>⌂</span>
              </div>

              <div className="listing-card-body">
                <h3>
                  {rental.title ||
                    rental.apartment_name ||
                    "Rental Property"}
                </h3>

                <p className="locality">
                  {rental.locality || "Location unavailable"}
                </p>

                <div className="property-details">
                  <span>
                    🛏 {rental.bedroom ?? "N/A"} BHK
                  </span>

                  <span>
                    ◇ {rental.bathroom ?? "N/A"} Bath
                  </span>

                  <span>
                    ▣ {rental.carpet_area ?? "N/A"} sq.ft
                  </span>
                </div>

                <div className="listing-footer">
                  <div>
                    <small>Monthly Rent</small>
                    <strong>
                      {formatRent(rental.price)}
                    </strong>
                  </div>

                  <button
                    className="view-button"
                    onClick={() =>
                      alert(
                        `Rental ID: ${rental.listing_id}`
                      )
                    }
                  >
                    View
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {currentRentals.length === 0 && (
          <div className="empty-state">
            <h3>No rentals found</h3>
            <p>Try changing your search or furnishing filter.</p>
          </div>
        )}

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

export default Rentals;