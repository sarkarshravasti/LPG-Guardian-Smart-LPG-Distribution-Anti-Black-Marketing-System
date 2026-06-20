import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import DashboardLayout from "../components/DashboardLayout";
import MetricCard from "../components/MetricCard";
import SectionCard from "../components/SectionCard";
import IndiaMap from "../components/IndiaMap";

function GovernmentDashboard() {
    const [consumerCount, setConsumerCount] = useState(0);
    const [distributorCount, setDistributorCount] = useState(0);
    const [requestCount, setRequestCount] = useState(0);
    const [complaintCount, setComplaintCount] = useState(0);
    const [pendingRequests, setPendingRequests] = useState(0);
    const [approvedRequests, setApprovedRequests] = useState(0);
    const [shippedRequests, setShippedRequests] = useState(0);
    const [rejectedRequests, setRejectedRequests] = useState(0);
    const [activeView, setActiveView] = useState("overview");
    const [searchTerm, setSearchTerm] = useState("");
    const cityCoordinates = {
  delhi: [28.6139, 77.2090],
  mumbai: [19.0760, 72.8777],
  kolkata: [22.5726, 88.3639],
  chennai: [13.0827, 80.2707],
  bengaluru: [12.9716, 77.5946],
  hyderabad: [17.3850, 78.4867],
};
function handleMapSearch(e) {
  if (e.key !== "Enter") return;

  const location =
    cityCoordinates[searchTerm.trim().toLowerCase()];

  if (!location) {
    alert("Location not found.");
    return;
  }

  if (window.lpgMap) {
    window.lpgMap.flyTo(location, 11, {
      animate: true,
      duration: 2,
    });
  }
}
    const [showNotifications, setShowNotifications] = useState(false);
    const pageConfig = {
  overview: {
    title: "National LPG Control Center",
    subtitle: "Monitor consumers, distributors, requests and complaints",
  },
  consumers: {
    title: "Consumer Explorer",
    subtitle: "View all LPG consumers across India",
  },
  distributors: {
    title: "Distributor Explorer",
    subtitle: "Monitor all LPG distributors nationwide",
  },
  requests: {
    title: "Order Monitoring Center",
    subtitle: "Track LPG requests and delivery workflow",
  },
  complaints: {
    title: "Complaint Management Center",
    subtitle: "Monitor and resolve citizen complaints",
  },
  stock: {
    title: "Stock Intelligence Center",
    subtitle: "Monitor inventory levels and stock movement",
  },
  reports: {
  title: "Reports & Analytics",
  subtitle: "National LPG performance and operational insights",
},
alerts: {
  title: "Alerts Center",
  subtitle: "Monitor critical system warnings and operational risks",
},

commandCenter: {
  title: "National Command Center",
  subtitle: "India-wide LPG monitoring and intelligence",
},

blackmarketing: {
  title: "Anti-Black Marketing Center",
  subtitle: "Detect suspicious bookings and distributor stock diversion",
},
};
    const [consumers, setConsumers] = useState([]);
    const [distributors, setDistributors] = useState([]);
    const [requests, setRequests] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [stockUpdates, setStockUpdates] = useState([]);
    const [distributorStock, setDistributorStock] = useState([]);
    const [alerts, setAlerts] = useState([]);
    useEffect(() => {
  fetchCounts();
}, []);

async function fetchCounts() {
  const [
  consumersResponse,
  distributorsResponse,
  requestsResponse,
  complaintsResponse,
  stockUpdatesResponse,
  distributorStockResponse,
] = await Promise.all([
  supabase.from("consumers").select("*"),
  supabase.from("distributors").select("*"),
  supabase.from("requests").select("*"),
  supabase.from("complaints").select("*"),
  supabase.from("stock_updates").select("*"),
  supabase.from("distributor_stock").select("*"),
]);

  setConsumerCount(consumersResponse.data?.length || 0);
  setDistributorCount(distributorsResponse.data?.length || 0);
  setRequestCount(requestsResponse.data?.length || 0);
  setComplaintCount(complaintsResponse.data?.length || 0);
  setConsumers(consumersResponse.data || []);
  setDistributors(distributorsResponse.data || []);
  setRequests(requestsResponse.data || []);
  setComplaints(complaintsResponse.data || []);
  setStockUpdates(stockUpdatesResponse.data || []);
  setDistributorStock(distributorStockResponse.data || []);
  setPendingRequests(
  requestsResponse.data?.filter(
    (request) => request.status === "Pending"
  ).length || 0
);

setApprovedRequests(
  requestsResponse.data?.filter(
    (request) => request.status === "Approved"
  ).length || 0
);

setShippedRequests(
  requestsResponse.data?.filter(
    (request) => request.status === "Shipped"
  ).length || 0
);

setRejectedRequests(
  requestsResponse.data?.filter(
    (request) => request.status === "Rejected"
  ).length || 0
);
const pendingCount =
  requestsResponse.data?.filter(
    (request) => request.status === "Pending"
  ).length || 0;

const complaintCountNow =
  complaintsResponse.data?.length || 0;

const generatedAlerts = [];

if (pendingCount > 5) {
  generatedAlerts.push({
    severity: "Warning",
    message: `${pendingCount} pending requests awaiting action`,
  });
}

if (complaintCountNow > 3) {
  generatedAlerts.push({
    severity: "Critical",
    message: `${complaintCountNow} complaints require review`,
  });
}

stockUpdatesResponse.data?.forEach((update) => {
  if (
    update.action?.toLowerCase() === "removed" &&
    update.quantity >= 4
  ) {
    generatedAlerts.push({
      severity: "Warning",
      message: `${update.distributor_name} removed ${update.quantity} cylinders`,
    });
  }
});

setAlerts(generatedAlerts);
}
    const navItems = [
    {
      id: "overview",
      label: "National Overview",
      description: "Country-wide LPG statistics",
      icon: "01",
    },
    {
      id: "consumers",
      label: "Consumers",
      description: "View all consumers",
      icon: "02",
    },
    {
      id: "distributors",
      label: "Distributors",
      description: "View all distributors",
      icon: "03",
    },
    {
      id: "requests",
      label: "Requests",
      description: "Monitor all requests",
      icon: "04",
    },
    {
      id: "complaints",
      label: "Complaints",
      description: "Track complaints",
      icon: "05",
    },
    {
      id: "stock",
      label: "Stock Intelligence",
      description: "Monitor inventory levels",
      icon: "06",
    },
    {
      id: "reports",
      label: "Reports & Analytics",
      description: "National performance metrics",
      icon: "07",
    },
    {
      id: "alerts",
      label: "Alerts Center",
      description: "Critical operational warnings",
      icon: "08",
    },
    {
  id: "commandCenter",
  label: "National Command Center",
  description: "Map intelligence & monitoring",
  icon: "09",
    },
    {
  id: "blackmarketing",
  label: "Anti-Black Marketing",
  description: "Fraud & diversion detection",
  icon: "10",
    },
  ];
  const handleLogout = () => {
  localStorage.removeItem("governmentUser");
  window.location.reload();
};

  return (
    <DashboardLayout
  brand="Government Portal"
  title={pageConfig[activeView].title}
  subtitle={pageConfig[activeView].subtitle}
      navItems={navItems}
      activeView={activeView}
      onViewChange={setActiveView}
    >
        <div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginBottom: "20px",
    position: "relative",
  }}
>
  <button
    onClick={() => setShowNotifications(!showNotifications)}
    style={{
      background: "#1e293b",
      color: "white",
      border: "none",
      padding: "10px 18px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
    }}
  >
    🔔 {alerts.length}
  </button>

  <button
    onClick={handleLogout}
    style={{
      background: "#dc2626",
      color: "white",
      border: "none",
      padding: "10px 18px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
    }}
  >
    Logout
  </button>
</div>
{showNotifications && (
  <div
    style={{
      background: "#0f172a",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "12px",
      padding: "16px",
      marginBottom: "20px",
      maxWidth: "500px",
      marginLeft: "auto",
    }}
  >
    <h3 style={{ marginBottom: "12px" }}>
      🔔 Notifications
    </h3>

    {alerts.length === 0 ? (
      <p>No active notifications.</p>
    ) : (
      alerts.map((alert, index) => (
        <div
          key={index}
          style={{
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.04)",
            borderLeft:
              alert.severity === "Critical"
                ? "4px solid #dc2626"
                : "4px solid #f59e0b",
          }}
        >
          <strong>{alert.severity}</strong>
          <div>{alert.message}</div>
        </div>
      ))
    )}
  </div>
)}
        {activeView === "overview" ? (
     <div className="metric-grid">
        <SectionCard
  eyebrow="Active Alerts"
  title={`🚨 ${alerts.length} Active Alerts`}
  description="Critical notifications requiring attention."
>
  {alerts.length === 0 ? (
    <p>All systems operating normally.</p>
  ) : (
    alerts.slice(0, 5).map((alert, index) => (
      <div
        key={index}
        style={{
          padding: "12px",
          marginBottom: "10px",
          borderRadius: "10px",
          background: "rgba(255,255,255,0.05)",
          borderLeft:
            alert.severity === "Critical"
              ? "4px solid #dc2626"
              : "4px solid #f59e0b",
        }}
      >
        <strong>{alert.severity}</strong>
        <div>{alert.message}</div>
      </div>
    ))
  )}
</SectionCard>
  <MetricCard
    label="Consumers"
    value={consumerCount}
    description="Registered consumers"
    tone="blue"
  />

  <MetricCard
    label="Distributors"
    value={distributorCount}
    description="Registered distributors"
    tone="green"
  />

  <MetricCard
    label="Requests"
    value={requestCount}
    description="Total LPG requests"
    tone="orange"
  />

  <MetricCard
    label="Complaints"
    value={complaintCount}
    description="Citizen complaints"
    tone="red"
  />
  <MetricCard
  label="Pending Requests"
  value={pendingRequests}
  description="Awaiting approval"
  tone="orange"
/>

<MetricCard
  label="Approved Requests"
  value={approvedRequests}
  description="Approved by distributors"
  tone="green"
/>

<MetricCard
  label="Shipped Orders"
  value={shippedRequests}
  description="Currently in transit"
  tone="blue"
/>

<MetricCard
  label="Rejected Requests"
  value={rejectedRequests}
  description="Rejected orders"
  tone="red"
/>
</div>
) : null}
{activeView === "consumers" ? (
  <SectionCard
    eyebrow="Consumer Explorer"
    title="All Registered Consumers"
    description="View all consumers registered in the LPG Guardian system."
  >
    <div style={{ marginBottom: "20px" }}>
  <input
    type="text"
    placeholder="Search consumers..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    onKeyDown={handleMapSearch}
    style={{
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid rgba(255,255,255,0.15)",
      background: "rgba(255,255,255,0.05)",
      color: "white",
      fontSize: "14px",
    }}
  />
</div>
    <div className="record-grid">
      {consumers
  .filter((consumer) =>
    consumer.consumer_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    consumer.state
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    consumer.district
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    consumer.consumer_number
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  )
  .map((consumer) => (
        <article key={consumer.id} className="record-card">
          <div className="record-card-header">
            <div>
              <p className="record-label">
                Consumer #{consumer.id}
              </p>
              <strong>{consumer.consumer_name}</strong>
            </div>
          </div>

          <div className="record-details">
            <p>
              <span>Phone</span>
              {consumer.phone || "-"}
            </p>

            <p>
              <span>Consumer No.</span>
              {consumer.consumer_number || "-"}
            </p>

            <p>
              <span>State</span>
              {consumer.state || "-"}
            </p>

            <p>
              <span>District</span>
              {consumer.district || "-"}
            </p>

            <p>
              <span>Pincode</span>
              {consumer.pincode || "-"}
            </p>
          </div>
        </article>
      ))}
    </div>
  </SectionCard>
) : null}
{activeView === "distributors" ? (
  <SectionCard
    eyebrow="Distributor Explorer"
    title="All Registered Distributors"
    description="View all distributors registered in the LPG Guardian system."
  >
    <div className="record-grid">
      {distributors.map((distributor) => (
        <article key={distributor.id} className="record-card">
          <div className="record-card-header">
            <div>
              <p className="record-label">
                Distributor #{distributor.id}
              </p>
              <strong>{distributor.name}</strong>
            </div>
          </div>

          <div className="record-details">
            <p>
              <span>State</span>
              {distributor.state || "-"}
            </p>

            <p>
              <span>District</span>
              {distributor.district || "-"}
            </p>

            <p>
              <span>Stock</span>
              {distributor.stock || 0}
            </p>

            <p>
              <span>Status</span>
              {distributor.status || "-"}
            </p>
          </div>
        </article>
      ))}
    </div>
  </SectionCard>
) : null}
{activeView === "requests" ? (
  <SectionCard
    eyebrow="Order Monitoring"
    title="All LPG Requests"
    description="Monitor requests across the country."
  >
    <div className="record-grid">
      {requests.map((request) => (
        <article key={request.id} className="record-card">
          <div className="record-card-header">
            <div>
              <p className="record-label">
                Request #{request.id}
              </p>
              <strong>{request.consumer_name}</strong>
            </div>
          </div>

          <div className="record-details">
            <p>
              <span>Status</span>
              {request.status || "-"}
            </p>

            <p>
              <span>State</span>
              {request.state || "-"}
            </p>

            <p>
              <span>District</span>
              {request.district || "-"}
            </p>

            <p>
              <span>Pincode</span>
              {request.pincode || "-"}
            </p>

            <p>
              <span>Distributor ID</span>
              {request.distributor_id || "-"}
            </p>

            <p>
              <span>Created</span>
              {request.created_at
                ? new Date(request.created_at).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </article>
      ))}
    </div>
  </SectionCard>
) : null}
{activeView === "complaints" ? (
  <SectionCard
    eyebrow="Complaint Center"
    title="All Citizen Complaints"
    description="Monitor complaints submitted across the country."
  >
    <div className="record-grid">
      {complaints.map((complaint) => (
        <article key={complaint.id} className="record-card">
          <div className="record-card-header">
            <div>
              <p className="record-label">
                Complaint #{complaint.id}
              </p>
              <strong>{complaint.citizen_name}</strong>
            </div>
          </div>

          <div className="record-details">
            <p>
              <span>District</span>
              {complaint.district || "-"}
            </p>

            <p>
              <span>Status</span>
              {complaint.status || "-"}
            </p>

            <p>
              <span>Created</span>
              {complaint.created_at
                ? new Date(complaint.created_at).toLocaleDateString()
                : "-"}
            </p>

            <p className="field-full">
              <span>Complaint</span>
              {complaint.complaint || "-"}
            </p>
          </div>
        </article>
      ))}
    </div>
  </SectionCard>
) : null}
{activeView === "stock" ? (
  <SectionCard
    eyebrow="Stock Intelligence"
    title="National Inventory Center"
    description="Monitor stock levels and inventory movements."
  >
    <h3>Distributor Inventory</h3>

    <div className="record-grid">
      {distributorStock.map((stock, index) => (
        <article key={index} className="record-card">
          <div className="record-details">
            <p>
              <span>Distributor</span>
              {stock.distributor_name || "-"}
            </p>

            <p>
              <span>Current Stock</span>
              {stock.current_stock || 0}
            </p>

            <p>
              <span>Reserved Stock</span>
              {stock.reserved_stock || 0}
            </p>
          </div>
        </article>
      ))}
    </div>

    <h3 style={{ marginTop: "32px" }}>
      Stock Movement History
    </h3>

    <div className="record-grid">
      {stockUpdates.map((update) => (
        <article key={update.id} className="record-card">
          <div className="record-details">
            <p>
              <span>Distributor</span>
              {update.distributor_name}
            </p>

            <p>
              <span>District</span>
              {update.district}
            </p>

            <p>
              <span>Cylinder</span>
              {update.cylinder_type}
            </p>

            <p>
              <span>Quantity</span>
              {update.quantity}
            </p>

            <p>
              <span>Action</span>
              {update.action}
            </p>
          </div>
        </article>
      ))}
    </div>
  </SectionCard>
) : null}
{activeView === "reports" ? (
  <SectionCard
    eyebrow="Executive Summary"
    title="National LPG Analytics"
    description="Country-wide operational metrics and performance indicators."
  >
    <div className="record-grid">
      <article className="record-card">
        <h3>Total Consumers</h3>
        <h1>{consumerCount}</h1>
      </article>

      <article className="record-card">
        <h3>Total Distributors</h3>
        <h1>{distributorCount}</h1>
      </article>

      <article className="record-card">
        <h3>Total Requests</h3>
        <h1>{requestCount}</h1>
      </article>

      <article className="record-card">
        <h3>Total Complaints</h3>
        <h1>{complaintCount}</h1>
      </article>

      <article className="record-card">
        <h3>Pending Requests</h3>
        <h1>{pendingRequests}</h1>
      </article>

      <article className="record-card">
        <h3>Approved Requests</h3>
        <h1>{approvedRequests}</h1>
      </article>

      <article className="record-card">
        <h3>Shipped Orders</h3>
        <h1>{shippedRequests}</h1>
      </article>

      <article className="record-card">
        <h3>Rejected Requests</h3>
        <h1>{rejectedRequests}</h1>
      </article>
    </div>
  </SectionCard>
) : null}
{activeView === "alerts" ? (
  <SectionCard
    eyebrow="National Alerts"
    title="Alerts Center"
    description="Monitor critical operational warnings and risks."
  >
    <div className="record-grid">
      {alerts.length === 0 ? (
        <article className="record-card">
          <h3>No Active Alerts</h3>
          <p>All systems operating normally.</p>
        </article>
      ) : (
        alerts.map((alert, index) => (
          <article
  key={index}
  className="record-card"
  style={{
    borderLeft:
      alert.severity === "Critical"
        ? "4px solid #dc2626"
        : alert.severity === "Warning"
        ? "4px solid #f59e0b"
        : "4px solid #16a34a",
  }}
>
            <div className="record-details">
              <p>
                <span>Severity</span>
                {alert.severity}
              </p>

              <p>
                <span>Alert</span>
                {alert.message}
              </p>
            </div>
          </article>
        ))
      )}
    </div>
  </SectionCard>
) : null}
{activeView === "commandCenter" ? (
  <SectionCard
    eyebrow="National Command Center"
    title="India LPG Monitoring Grid"
    description="Real-time distributor and consumer intelligence."
  >
    <div
  style={{
    display: "grid",
    gridTemplateColumns: "280px minmax(700px,1fr) 320px",
    gap: "20px",
    height: "calc(100vh - 260px)",
    alignItems: "stretch",
  }}
>
      {/* LEFT PANEL */}
      <div
  style={{
    background: "#0f172a",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid rgba(255,255,255,0.08)",
  }}
>
  <div
    style={{
      color: "#64748b",
      fontSize: "11px",
      letterSpacing: "2px",
      marginBottom: "16px",
    }}
  >
    MAP CONTROLS
  </div>

  <details open>
    <summary
      style={{
        cursor: "pointer",
        marginBottom: "12px",
        color: "#00E08A",
        fontWeight: "600",
      }}
    >
      🗂 Map Layers
    </summary>

    <div style={{ lineHeight: "2" }}>
      <div>☑ Consumers</div>
      <div>☑ Distributors</div>
      <div>☑ Complaint Hotspots</div>
      <div>☑ Low Stock Zones</div>
      <div>☐ Demand Heatmap</div>
    </div>
  </details>

  <details style={{ marginTop: "20px" }}>
    <summary
      style={{
        cursor: "pointer",
        color: "#00E08A",
        fontWeight: "600",
      }}
    >
      🗺 Map Mode
    </summary>

    <div
      style={{
        marginTop: "10px",
        lineHeight: "2",
      }}
    >
      <div>Standard</div>
      <div>Satellite</div>
      <div>Terrain</div>
      <div>Heatmap</div>
    </div>
  </details>

  <div
    style={{
      height: "1px",
      background: "rgba(255,255,255,0.08)",
      margin: "24px 0",
    }}
  />

  <div
    style={{
      color: "#64748b",
      fontSize: "11px",
      letterSpacing: "2px",
      marginBottom: "12px",
    }}
  >
    LEGEND
  </div>

  <div style={{ lineHeight: "2.2" }}>
    <div>🟢 Consumer</div>
    <div>🔵 Distributor</div>
    <div>🔴 Complaint Hotspot</div>
    <div>🟠 Low Stock Zone</div>
    <div>🟣 Flagged Distributor</div>
  </div>

  <div
    style={{
      height: "1px",
      background: "rgba(255,255,255,0.08)",
      margin: "24px 0",
    }}
  />

  <div
    style={{
      color: "#64748b",
      fontSize: "11px",
      letterSpacing: "2px",
      marginBottom: "12px",
    }}
  >
    QUICK STATS
  </div>

  <div style={{ display: "grid", gap: "10px" }}>
    <div>🟢 Active Distributors: {distributorCount}</div>
    <div>🔴 Complaints: {complaintCount}</div>
    <div>🟠 Pending Requests: {pendingRequests}</div>
    <div>👤 Consumers: {consumerCount}</div>
  </div>
</div>

      {/* MAP AREA */}
      <div
  style={{
    position: "relative",
    background: "#0f172a",
    borderRadius: "16px",
    overflow: "hidden",
    height: "750px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 0 40px rgba(0,224,138,0.08)",
  }}
>
        <input
  placeholder="Search district, state or distributor..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  onKeyDown={handleMapSearch}
  style={{
    position: "absolute",
    top: "18px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#0f172a",
    color: "white",
    border: "1px solid rgba(0,224,138,0.2)",
    zIndex: 1000,
    width: "360px",
    padding: "14px",
    borderRadius: "12px",
    outline: "none",
    boxShadow: "0 8px 25px rgba(0,0,0,0.35)",
  }}
/>

       <IndiaMap />
       <div
  style={{
    position: "absolute",
    bottom: "20px",
    left: "20px",
    background: "rgba(15,23,42,0.92)",
    border: "1px solid rgba(0,224,138,0.15)",
    borderRadius: "14px",
    padding: "16px",
    zIndex: 1000,
    minWidth: "240px",
    backdropFilter: "blur(10px)",
  }}
>
  <div
    style={{
      color: "#00E08A",
      fontWeight: "700",
      marginBottom: "12px",
    }}
  >
    National Status
  </div>

  <div style={{ color: "#cbd5e1", lineHeight: "1.8" }}>
    🟢 Consumers: {consumerCount}
    <br />
    🔵 Distributors: {distributorCount}
    <br />
    🟠 Pending: {pendingRequests}
    <br />
    🔴 Complaints: {complaintCount}
  </div>
</div>
      </div>

      {/* RIGHT PANEL */}
      <div
        style={{
          background: "#0f172a",
          borderRadius: "16px",
          padding: "20px",
        }}
      >
        <h3
  style={{
    marginBottom: "20px",
    color: "#00E08A",
  }}
>
  Analytics
</h3>

<div
  style={{
    display: "grid",
    gap: "12px",
  }}
>
  <div
    style={{
      background: "rgba(0,224,138,0.08)",
      border: "1px solid rgba(0,224,138,0.2)",
      borderRadius: "12px",
      padding: "16px",
    }}
  >
    <div style={{ color: "#94a3b8", fontSize: "12px" }}>
      Consumers
    </div>
    <div style={{ fontSize: "28px", color: "#00E08A" }}>
      {consumerCount}
    </div>
  </div>

  <div
    style={{
      background: "rgba(59,130,246,0.08)",
      border: "1px solid rgba(59,130,246,0.2)",
      borderRadius: "12px",
      padding: "16px",
    }}
  >
    <div style={{ color: "#94a3b8", fontSize: "12px" }}>
      Distributors
    </div>
    <div style={{ fontSize: "28px", color: "#3b82f6" }}>
      {distributorCount}
    </div>
  </div>

  <div
    style={{
      background: "rgba(245,158,11,0.08)",
      border: "1px solid rgba(245,158,11,0.2)",
      borderRadius: "12px",
      padding: "16px",
    }}
  >
    <div style={{ color: "#94a3b8", fontSize: "12px" }}>
      Requests
    </div>
    <div style={{ fontSize: "28px", color: "#f59e0b" }}>
      {requestCount}
    </div>
  </div>

  <div
    style={{
      background: "rgba(239,68,68,0.08)",
      border: "1px solid rgba(239,68,68,0.2)",
      borderRadius: "12px",
      padding: "16px",
    }}
  >
    <div style={{ color: "#94a3b8", fontSize: "12px" }}>
      Complaints
    </div>
    <div style={{ fontSize: "28px", color: "#ef4444" }}>
      {complaintCount}
    </div>
  </div>
</div>
      </div>
    </div>
  </SectionCard>
) : null}
{activeView === "blackmarketing" ? (
  <SectionCard
    eyebrow="Fraud Detection"
    title="Anti-Black Marketing Center"
    description="Monitor suspicious LPG activity and stock diversion."
  >
    <div className="record-grid">

      <article className="record-card">
        <h3>🚨 High Risk Distributors</h3>
        <p>0 flagged distributors</p>
      </article>

      <article className="record-card">
        <h3>📦 Stock Diversion Alerts</h3>
        <p>0 active alerts</p>
      </article>

      <article className="record-card">
        <h3>⚠ Suspicious Booking Patterns</h3>
        <p>0 suspicious consumers</p>
      </article>

    </div>
  </SectionCard>
) : null}
    </DashboardLayout>
  );
}
export default GovernmentDashboard;
