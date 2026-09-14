import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetch("/data/listings.json")
      .then((res) => res.json())
      .then((listings) => {
        const foundListing = listings.find(
          (item) => String(item.listing_id) === String(id)
        );

        setListing(foundListing);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading listing:", error);
        setLoading(false);
      });
  }, [id]);

  // Check whether this listing is already saved
  useEffect(() => {
    const savedListings = JSON.parse(
      localStorage.getItem("savedListings") || "[]"
    );

    const alreadySaved = savedListings.some(
      (savedId) => String(savedId) === String(id)
    );

    setIsSaved(alreadySaved);
  }, [id]);

  const formatPrice = (price) => {
    if (!price) return "N/A";

    return `₹${new Intl.NumberFormat("en-IN").format(price)}`;
  };

  // Save or remove listing from saved list
  const toggleSave = () => {
    const savedListings = JSON.parse(
      localStorage.getItem("savedListings") || "[]"
    );

    const listingId = String(listing.listing_id);

    const alreadySaved = savedListings.some(
      (savedId) => String(savedId) === listingId
    );

    let updatedSavedListings;

    if (alreadySaved) {
      updatedSavedListings = savedListings.filter(
        (savedId) => String(savedId) !== listingId
      );

      setIsSaved(false);
    } else {
      updatedSavedListings = [...savedListings, listingId];

      setIsSaved(true);
    }

    localStorage.setItem(
      "savedListings",
      JSON.stringify(updatedSavedListings)
    );
  };

  if (loading) {
    return <div className="loading">Loading property details...</div>;
  }

  if (!listing) {
    return (
      <div className="loading">
        <div>
          <h2>Listing not found</h2>

          <button
            className="header-button"
            onClick={() => navigate("/listings")}
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">I</div>

          <div>
            <h2>Ivy Homes</h2>
            <span>Property Intelligence</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button onClick={() => navigate("/listings")}>
            <span>⌂</span>
            Listings
          </button>

          <button onClick={() => navigate("/saved")}>
            <span>♡</span>
            Saved
          </button>

          <button onClick={() => navigate("/insights")}>
            <span>▥</span>
            Insights
          </button>

          <button onClick={() => navigate("/projects")}>
            <span>▦</span>
            Projects
          </button>

          <button onClick={() => navigate("/rentals")}>
            <span>⌂</span>
            Rentals
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <button
          className="back-button"
          onClick={() => navigate("/listings")}
        >
          ← Back to Listings
        </button>

        <div className="detail-header">
          <div>
            <p className="eyebrow">PROPERTY DETAILS</p>

            <h1>
              {listing.apartment_name || "Property Listing"}
            </h1>

            <p className="subtitle">
              {listing.locality || "Location not available"}
            </p>
          </div>

          <div className="detail-price">
            {formatPrice(listing.price)}
          </div>
        </div>

        <section className="detail-grid">
          <div className="detail-main-card">
            <div className="property-placeholder">
              <span>🏠</span>
              <p>Property Preview</p>
            </div>

            <div className="detail-section">
              <h2>Property Overview</h2>

              <div className="detail-info-grid">
                <div>
                  <span>Listing ID</span>
                  <strong>{listing.listing_id}</strong>
                </div>

                <div>
                  <span>Property Type</span>
                  <strong>{listing.property_type || "N/A"}</strong>
                </div>

                <div>
                  <span>Bedrooms</span>
                  <strong>{listing.bedroom ?? "N/A"}</strong>
                </div>

                <div>
                  <span>Bathrooms</span>
                  <strong>{listing.bathroom ?? "N/A"}</strong>
                </div>

                <div>
                  <span>Carpet Area</span>
                  <strong>
                    {listing.carpet_area
                      ? `${listing.carpet_area} sqft`
                      : "N/A"}
                  </strong>
                </div>

                <div>
                  <span>Super Built-up Area</span>
                  <strong>
                    {listing.super_built_up_area
                      ? `${listing.super_built_up_area} sqft`
                      : "N/A"}
                  </strong>
                </div>

                <div>
                  <span>Floor</span>
                  <strong>
                    {listing.floor ?? "N/A"} /{" "}
                    {listing.total_floors ?? "N/A"}
                  </strong>
                </div>

                <div>
                  <span>Furnishing</span>
                  <strong>{listing.furnishing || "N/A"}</strong>
                </div>

                <div>
                  <span>Facing Direction</span>
                  <strong>
                    {listing.facing_direction || "N/A"}
                  </strong>
                </div>

                <div>
                  <span>Parking</span>
                  <strong>
                    {listing.covered_parking
                      ? "Available"
                      : "Not specified"}
                  </strong>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h2>Description</h2>

              <p className="description-text">
                {listing.description ||
                  "No description available for this listing."}
              </p>
            </div>
          </div>

          <div className="detail-side-card">
            <h2>Listing Information</h2>

            <div className="side-info">
              <span>City ID</span>
              <strong>{listing.city_id || "N/A"}</strong>
            </div>

            <div className="side-info">
              <span>Project ID</span>
              <strong>{listing.project_id || "Independent"}</strong>
            </div>

            <div className="side-info">
              <span>Posted By</span>
              <strong>{listing.posted_by || "N/A"}</strong>
            </div>

            <div className="side-info">
              <span>Verification</span>
              <strong>
                {listing.is_verified ? "Verified" : "Not Verified"}
              </strong>
            </div>

            <div className="side-info">
              <span>Listing Status</span>
              <strong>
                {listing.is_live ? "Active" : "Inactive"}
              </strong>
            </div>

            <button
              className="save-detail-button"
              onClick={toggleSave}
            >
              {isSaved ? "♥ Saved" : "♡ Save Listing"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ListingDetail;