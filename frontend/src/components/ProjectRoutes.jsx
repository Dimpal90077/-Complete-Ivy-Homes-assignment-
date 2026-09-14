import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/Login";
import Listings from "../pages/Listings";
import Rentals from "../pages/Rentals";
import Projects from "../pages/Projects";
import Insights from "../pages/Insights";
import ListingDetail from "../pages/ListingDetail";
import SavedListings from "../pages/SavedListings";

function ProjectRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route path="/saved" element={<SavedListings />} />
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/insights" element={<Insights />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default ProjectRoutes;