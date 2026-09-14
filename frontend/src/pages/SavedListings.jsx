import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function SavedListings() {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [savedIds, setSavedIds] = useState(() => {
    const saved = localStorage.getItem("savedListings");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    async function loadListings() {
      const response = await fetch("/data/listings.json");
      const data = await response.json();

      const savedProperties = data.filter((item) =>
        savedIds.includes(item.listing_id)
      );

      setListings(savedProperties);
    }

    loadListings();
  }, [savedIds]);

  function removeSaved(listingId) {
    const updatedIds = savedIds.filter(
      (id) => id !== listingId
    );

    setSavedIds(updatedIds);
    localStorage.setItem(
      "savedListings",
      JSON.stringify(updatedIds)
    );
  }

  function formatPrice(price) {
    if (!price || price <= 0) return "Price unavailable";

    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }

    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }

    return `₹${price.toLocaleString("en-IN")}`;
  }

  return (
    <div className="saved-page">
      <div className="saved-header">
        <button
          className="back-button"
          onClick={() => navigate("/listings")}
        >
          ← Back to Listings
        </button>

        <h1>Saved Properties</h1>
        <p>Your favourite properties are stored here.</p>
      </div>

      {listings.length === 0 ? (
        <div className="empty-state">
          <h2>No saved properties yet</h2>
          <p>
            Click the heart icon on any listing to save it.
          </p>

          <button
            className="primary-action"
            onClick={() => navigate("/listings")}
          >
            Explore Listings
          </button>
        </div>
      ) : (
        <div className="listing-grid">
          {listings.map((listing) => (
            <article
              className="listing-card"
              key={listing.listing_id}
            >
              <div className="property-image-placeholder">
                <span>⌂</span>
              </div>

              <div className="listing-card-body">
                <span className="property-badge">
                  {listing.property_type || "Property"}
                </span>

                <h3>
                  {listing.apartment_name ||
                    "Unnamed Property"}
                </h3>

                <p className="locality">
                  {listing.locality || "Location unavailable"}
                </p>

                <div className="property-details">
                  <span>{listing.bedroom} BHK</span>
                  <span>{listing.bathroom} Bath</span>
                  <span>{listing.carpet_area} sq.ft</span>
                </div>

                <div className="listing-footer">
                  <strong>
                    {formatPrice(listing.price)}
                  </strong>

                  <div>
                    <button
                      className="view-button"
                      onClick={() =>
                        navigate(
                          `/listings/${listing.listing_id}`
                        )
                      }
                    >
                      View
                    </button>

                    <button
                      className="remove-save-button"
                      onClick={() =>
                        removeSaved(listing.listing_id)
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedListings;