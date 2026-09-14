import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { loginUser } from "../services/api";

function login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(email, password);

      console.log("Login API response:", data);

      // API response ke according token field
      const token = data.access_token || data.token;

      if (token) {
        localStorage.setItem("access_token", token);
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);

      alert("Login successful!");

      // Login ke baad Listings page par redirect
      navigate("/listings");
    } catch (err) {
      setError(
        err.message || "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="brand">
          <div className="brand-icon">I</div>
          <span>Ivy Homes</span>
        </div>

        <div className="left-content">
          <h1>
            Find a place
            <br />
            you can call <span>home.</span>
          </h1>

          <p>
            Explore verified properties, discover your next home,
            and make better real-estate decisions.
          </p>

          <div className="features">
            <div className="feature-item">
              <span>✓</span>
              <p>Verified property listings</p>
            </div>

            <div className="feature-item">
              <span>✓</span>
              <p>Smart search and filters</p>
            </div>

            <div className="feature-item">
              <span>✓</span>
              <p>Save your favourite properties</p>
            </div>
          </div>
        </div>

        <div className="left-footer">
          © 2026 Ivy Homes. All rights reserved.
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="mobile-brand">
            <div className="brand-icon">I</div>
            <span>Ivy Homes</span>
          </div>

          <h2>Welcome back</h2>

          <p className="subtitle">
            Sign in to continue exploring properties
          </p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <div className="password-label">
                <label htmlFor="password">Password</label>

                <a href="#forgot">Forgot password?</a>
              </div>

              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}

              {!loading && <span>→</span>}
            </button>
          </form>

          <p className="signup-text">
            Don't have an account?{" "}
            <a href="#signup">Create an account</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default login;