import { useState } from "react";
import { supabase } from "../lib/supabase";

const demoConsumers = [
  {
    id: 1,
    consumer_name: "Rahul Sharma",
    consumer_number: "C-1001",
    password: "Pass@1001",
    phone: "9876543210",
    email: "rahul.sharma@example.com",
    address: "Flat 12B, Sector 5",
    city: "Delhi",
    pincode: "110016",
  },
  {
    id: 2,
    consumer_name: "Pooja Mehta",
    consumer_number: "C-1002",
    password: "Welcome2026",
    phone: "9123456780",
    email: "pooja.mehta@example.com",
    address: "26 MG Road",
    city: "Mumbai",
    pincode: "400001",
  },
];

function ConsumerLogin({ setPage }) {
  const [consumerNumber, setConsumerNumber] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const { data, error } = await supabase
      .from("consumers")
      .select("*")
      .eq("consumer_number", consumerNumber)
      .eq("password", password)
      .single();

    const fallback = demoConsumers.find(
      (item) => item.consumer_number === consumerNumber && item.password === password
    );

    if ((error || !data) && !fallback) {
      alert("Invalid Consumer Number or Password");
      console.log(error);
      return;
    }

    const user = data || fallback;

    localStorage.setItem(
      "consumerId",
      user.id
    );

    localStorage.setItem(
      "consumerName",
      user.consumer_name
    );

    localStorage.setItem(
      "consumerNumber",
      user.consumer_number
    );

    localStorage.setItem(
      "consumerLookupName",
      user.consumer_name
    );

    localStorage.setItem(
      "consumerProfile",
      JSON.stringify({
        name: user.consumer_name,
        phone: user.phone || "",
        email: user.email || "",
        address: user.address || "",
        city: user.city || "",
        pincode: user.pincode || "",
      })
    );

    alert(
      `Welcome ${user.consumer_name}!`
    );
    window.location.reload();

    // Next step:
    // setPage("consumerDashboard");
  }

  return (
  <div
    style={{
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #071426 0%, #081a34 50%, #071426 100%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      color: "white",
      fontFamily: "Inter, sans-serif",
      position: "relative",
    }}
  >
    <button
      onClick={() => setPage("home")}
      style={{
        position: "absolute",
        top: "30px",
        left: "30px",
        padding: "12px 22px",
        borderRadius: "999px",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "#0C1D35",
        color: "white",
        cursor: "pointer",
        fontWeight: "600",
      }}
    >
      ← Back
    </button>

    <div
      style={{
        width: "100%",
        maxWidth: "450px",
        background: "#0C1D35",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "24px",
        padding: "40px",
      }}
    >
      <p
        style={{
          color: "#00E08A",
          letterSpacing: "3px",
          fontSize: "14px",
          fontWeight: "600",
          marginBottom: "10px",
        }}
      >
        CONSUMER PORTAL
      </p>

      <h1
        style={{
          marginTop: 0,
          marginBottom: "10px",
          fontSize: "42px",
        }}
      >
        Welcome Back
      </h1>

      <p
        style={{
          color: "#A7B0C0",
          marginBottom: "30px",
        }}
      >
        Login to access your LPG Guardian account.
      </p>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Consumer Number"
          value={consumerNumber}
          onChange={(e) =>
            setConsumerNumber(e.target.value)
          }
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "16px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "#071426",
            color: "white",
            fontSize: "15px",
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "24px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "#071426",
            color: "white",
            fontSize: "15px",
            boxSizing: "border-box",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "999px",
            border: "none",
            background: "#00E08A",
            color: "#071426",
            fontWeight: "700",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Login
        </button>
      </form>

      <div
        style={{
          marginTop: "30px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#A7B0C0",
            marginBottom: "12px",
          }}
        >
          Don't have a Consumer ID?
        </p>

        <button
          type="button"
          onClick={() =>
            setPage("consumerRegister")
          }
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
            padding: "12px 24px",
            borderRadius: "999px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Create Consumer Account
        </button>
      </div>
    </div>
  </div>
);
}

export default ConsumerLogin;