import { useState } from "react";
import { supabase } from "../lib/supabase";

const demoGovernmentUsers = [
  { username: "gov_admin", password: "India2026" },
  { username: "national_commander", password: "SecureGov#1" },
];

function GovernmentLogin({ setPage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    const { data, error } = await supabase
      .from("government_users")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single();

    const fallback = demoGovernmentUsers.find(
      (item) => item.username === username && item.password === password
    );

    if ((error || !data) && !fallback) {
      setError("Invalid username or password.");
      return;
    }

    const user = data || fallback;

    localStorage.setItem("governmentUser", user.username);
    setPage("government");
  };

  return (
    <div className="page-shell page-center bg-dusk">
      <div className="auth-card auth-card--large">
        <div className="auth-card__side auth-card__side--branding">
          <div>
            <p className="eyebrow">Government Portal</p>
            <h1>National Command Login</h1>
            <p className="auth-copy">
              Secure access for government officers to monitor LPG distribution,
              request volume, and operational trends across the country.
            </p>
          </div>
        </div>

        <div className="auth-card__side auth-card__side--form">
          <p className="eyebrow">Sign In</p>
          <h2>Secure Government Access</h2>

          <label className="field">
            <span>Username</span>
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-input"
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-input"
            />
          </label>

          {error ? <div className="form-error">{error}</div> : null}

          <div className="form-actions">
            <button className="primary-button" onClick={handleLogin}>
              Login
            </button>
            <button
              className="secondary-button"
              onClick={() => setPage("home")}
              type="button"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GovernmentLogin;
