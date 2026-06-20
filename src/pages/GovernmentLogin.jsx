import { useState } from "react";
import { supabase } from "../lib/supabase";

function GovernmentLogin({ setPage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { data } = await supabase
      .from("government_users")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single();

    if (data) {
      localStorage.setItem("governmentUser", data.username);
      setPage("government");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#071426",
        color: "white",
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "32px",
          borderRadius: "16px",
          background: "#0B1F38",
        }}
      >
        <h1>Government Login</h1>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "16px",
          }}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "16px",
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "12px",
            background: "#00E08A",
            border: "none",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default GovernmentLogin;