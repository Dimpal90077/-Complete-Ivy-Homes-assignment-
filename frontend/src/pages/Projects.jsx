import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch("/data/projects.json");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const text = search.toLowerCase().trim();

    return projects.filter((project) => {
      const searchableText = Object.values(project)
        .map((value) => String(value ?? "").toLowerCase())
        .join(" ");

      return searchableText.includes(text);
    });
  }, [projects, search]);

  if (loading) {
    return <div className="loading">Loading projects...</div>;
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
            <p className="eyebrow">PROJECT DIRECTORY</p>
            <h1>Residential Projects</h1>
            <p className="subtitle">
              Explore projects available in the dataset
            </p>
          </div>

          <button
            className="header-button"
            onClick={() => navigate("/listings")}
          >
            All Listings
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span>Total Projects</span>
            <strong>{projects.length}</strong>
          </div>

          <div className="stat-card">
            <span>Matching Projects</span>
            <strong>{filteredProjects.length}</strong>
          </div>
        </div>

        <div className="filters-bar">
          <input
            type="text"
            placeholder="Search project, locality, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="listing-grid">
          {filteredProjects.map((project, index) => (
            <div className="listing-card" key={project.project_id || index}>
              <span className="property-badge">Project</span>

              <h3>
                {project.project_name ||
                  project.name ||
                  project.apartment_name ||
                  "Residential Project"}
              </h3>

              <p className="location">
                {project.locality ||
                  project.city ||
                  project.location ||
                  "Location unavailable"}
              </p>

              <p>
                <strong>Project ID:</strong>{" "}
                {project.project_id || "N/A"}
              </p>

              <p>
                <strong>Developer:</strong>{" "}
                {project.developer || project.builder || "N/A"}
              </p>

              <p>
                <strong>Listings:</strong>{" "}
                {project.listing_count ??
                  project.total_listings ??
                  "N/A"}
              </p>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="empty-state">
            <h2>No projects found</h2>
          </div>
        )}
      </main>
    </div>
  );
}

export default Projects;