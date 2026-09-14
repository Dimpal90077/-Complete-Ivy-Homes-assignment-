import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Insights() {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [listingResponse, rentalResponse, projectResponse] =
          await Promise.all([
            fetch("/data/listings.json"),
            fetch("/data/rentals.json"),
            fetch("/data/projects.json"),
          ]);

        const listingData = await listingResponse.json();
        const rentalData = await rentalResponse.json();
        const projectData = await projectResponse.json();

        setListings(listingData);
        setRentals(rentalData);
        setProjects(projectData);
      } catch (error) {
        console.error("Error loading insights:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const activeListings = listings.filter(
    (listing) => listing.is_live === true
  ).length;

  const verifiedListings = listings.filter(
    (listing) => listing.is_verified === true
  ).length;

  const averagePrice =
    listings.length > 0
      ? listings.reduce(
          (sum, listing) => sum + Number(listing.price || 0),
          0
        ) / listings.length
      : 0;

  if (loading) {
    return <div className="loading">Loading insights...</div>;
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
          <button onClick={() => navigate("/listings")}>⌂ Listings</button>
          <button onClick={() => navigate("/saved")}>♡ Saved</button>
          <button onClick={() => navigate("/insights")}>▥ Insights</button>
          <button onClick={() => navigate("/projects")}>▦ Projects</button>
          <button onClick={() => navigate("/rentals")}>⌂ Rentals</button>
        </nav>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <p className="eyebrow">DATA INSIGHTS</p>
            <h1>Property Intelligence</h1>
            <p className="subtitle">
              Summary of listings, rentals and project inventory
            </p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span>Total Listings</span>
            <strong>{listings.length}</strong>
          </div>

          <div className="stat-card">
            <span>Active Listings</span>
            <strong>{activeListings}</strong>
          </div>

          <div className="stat-card">
            <span>Verified Listings</span>
            <strong>{verifiedListings}</strong>
          </div>

          <div className="stat-card">
            <span>Total Rentals</span>
            <strong>{rentals.length}</strong>
          </div>

          <div className="stat-card">
            <span>Total Projects</span>
            <strong>{projects.length}</strong>
          </div>

          <div className="stat-card">
            <span>Average Listing Price</span>
            <strong>
              ₹{Math.round(averagePrice).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        <div className="detail-main-card">
          <h2>Dataset Summary</h2>

          <p>
            This dashboard provides an overview of the property inventory
            available in the supplied datasets.
          </p>

          <ul>
            <li>Listings can be searched and filtered.</li>
            <li>Individual listing details are available.</li>
            <li>Listings can be saved using browser persistence.</li>
            <li>Rental and project inventories are separately accessible.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default Insights;