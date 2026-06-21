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
    const [mapMode, setMapMode] = useState("standard");
    const [mapLayers, setMapLayers] = useState({
      consumers: true,
      distributors: true,
      complaints: true,
      lowStock: true,
      heatmap: false,
    });
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

  if (mapInstance) {
    mapInstance.flyTo(location, 11, {
      animate: true,
      duration: 2,
    });
  }
}

function toggleMapLayer(layer) {
  setMapLayers((current) => ({
    ...current,
    [layer]: !current[layer],
  }));
}
    const [showNotifications, setShowNotifications] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);
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
traceability: {
  title: "Traceability Engine",
  subtitle: "Cylinder and truck audit workflow",
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
    const [traceabilityData] = useState({
      summary: {
        registeredCylinders: 5200,
        activeTrucks: 4,
        completedDeliveries: 318,
        flaggedTransfers: 12,
      },
      steps: [
        {
          title: "Cylinder Registration",
          description:
            "Unique QR assigned and linked to cloud inventory.",
          status: "Complete",
          timestamp: "2026-06-21 08:16",
        },
        {
          title: "Filling Plant",
          description:
            "Cylinder scanned at plant and filling record created.",
          status: "Complete",
          timestamp: "2026-06-21 09:05",
        },
        {
          title: "Warehouse Transfer",
          description:
            "Cylinder moved into warehouse and status updated.",
          status: "Complete",
          timestamp: "2026-06-21 10:24",
        },
        {
          title: "Truck Loading",
          description:
            "Cylinders assigned to trucks with GPS trackers.",
          status: "Live",
          timestamp: "2026-06-21 11:30",
        },
        {
          title: "Live Tracking",
          description:
            "Truck location monitored in real time with cylinder load.",
          status: "Active",
          timestamp: "2026-06-21 12:04",
        },
        {
          title: "Customer Delivery",
          description:
            "Delivery agent scans QR and records confirmation/OTP.",
          status: "Pending",
          timestamp: "2026-06-21 12:42",
        },
      ],
      trucks: [
        {
          id: "TRK-07",
          route: "Mumbai → Pune",
          cylinders: ["LPG101", "LPG102", "LPG103"],
          status: "On Route",
          deviation: "No",
          coordinates: [18.5204, 73.8567],
        },
        {
          id: "TRK-11",
          route: "Delhi → Agra",
          cylinders: ["LPG201", "LPG202"],
          status: "Paused",
          deviation: "Low",
          coordinates: [28.6260, 77.2410],
        },
        {
          id: "TRK-19",
          route: "Chennai → Bengaluru",
          cylinders: ["LPG301", "LPG302", "LPG303"],
          status: "Delayed",
          deviation: "High",
          coordinates: [12.9716, 77.5946],
        },
      ],
      deliveries: [
        {
          cylinderId: "101",
          customer: "U-8821",
          status: "Delivered",
          confirmation: "OTP verified",
        },
        {
          cylinderId: "102",
          customer: "U-9102",
          status: "Blocked hoarder",
          confirmation: "Investigating",
        },
        {
          cylinderId: "103",
          customer: "U-1120",
          status: "Pending",
          confirmation: "Awaiting OTP",
        },
      ],
    });

    const [selectedTruck, setSelectedTruck] = useState(null);

    useEffect(() => {
      if (!selectedTruck && traceabilityData.trucks?.length) {
        setSelectedTruck(traceabilityData.trucks[0]);
      }
    }, [selectedTruck, traceabilityData.trucks]);

    useEffect(() => {
      if (!mapInstance || !selectedTruck?.coordinates) return;
      mapInstance.flyTo(selectedTruck.coordinates, 7, {
        animate: true,
        duration: 1,
      });
    }, [mapInstance, selectedTruck]);

    const sampleConsumers = [
      { id: 1, consumer_name: "Raj Kumar", consumer_number: "LPG001001", state: "Maharashtra", district: "Mumbai" },
      { id: 2, consumer_name: "Priya Singh", consumer_number: "LPG001002", state: "Delhi", district: "South Delhi" },
      { id: 3, consumer_name: "Amit Patel", consumer_number: "LPG001003", state: "Gujarat", district: "Ahmedabad" },
      { id: 4, consumer_name: "Neha Verma", consumer_number: "LPG001004", state: "West Bengal", district: "Kolkata" },
      { id: 5, consumer_name: "Suresh Nair", consumer_number: "LPG001005", state: "Kerala", district: "Thiruvananthapuram" },
    ];

    const sampleDistributors = [
      { id: 1, name: "Mumbai LPG Distribution", state: "Maharashtra", district: "Mumbai", stock: 520 },
      { id: 2, name: "Delhi LPG Supply Co", state: "Delhi", district: "South Delhi", stock: 410 },
      { id: 3, name: "Gujarat Gas Agency", state: "Gujarat", district: "Ahmedabad", stock: 360 },
      { id: 4, name: "Kolkata Cylinder Works", state: "West Bengal", district: "Kolkata", stock: 240 },
      { id: 5, name: "Kerala Energy Hub", state: "Kerala", district: "Thiruvananthapuram", stock: 300 },
    ];

    const sampleRequests = [
      { id: 101, consumer_name: "Raj Kumar", state: "Maharashtra", district: "Mumbai", distributor_id: 1, pincode: "400001", status: "Pending" },
      { id: 102, consumer_name: "Priya Singh", state: "Delhi", district: "South Delhi", distributor_id: 2, pincode: "110016", status: "Approved" },
      { id: 103, consumer_name: "Amit Patel", state: "Gujarat", district: "Ahmedabad", distributor_id: 3, pincode: "380001", status: "Shipped" },
      { id: 104, consumer_name: "Neha Verma", state: "West Bengal", district: "Kolkata", distributor_id: 4, pincode: "700001", status: "Completed" },
      { id: 105, consumer_name: "Suresh Nair", state: "Kerala", district: "Thiruvananthapuram", distributor_id: 5, pincode: "695001", status: "Rejected" },
      { id: 106, consumer_name: "Raj Kumar", state: "Maharashtra", district: "Pune", distributor_id: 1, pincode: "411001", status: "Pending" },
      { id: 107, consumer_name: "Priya Singh", state: "Delhi", district: "North Delhi", distributor_id: 2, pincode: "110007", status: "Shipped" },
    ];

    const sampleComplaints = [
      { id: 201, consumer_name: "Raj Kumar", subject: "Delayed refill", status: "Open", district: "Mumbai", state: "Maharashtra", complaint: "Cylinder was delivered late and the customer was not notified." },
      { id: 202, consumer_name: "Priya Singh", subject: "Distributor mismatch", status: "Open", district: "South Delhi", state: "Delhi", complaint: "Received wrong distributor details in the confirmation." },
      { id: 203, consumer_name: "Amit Patel", subject: "Damaged cylinder", status: "In Review", district: "Ahmedabad", state: "Gujarat", complaint: "The cylinder valve was bent on arrival." },
      { id: 204, consumer_name: "Neha Verma", subject: "Missing OTP", status: "Resolved", district: "Kolkata", state: "West Bengal", complaint: "Delivery confirmation OTP failed three times." },
    ];

    const sampleStockUpdates = [
      { id: 301, distributor_name: "Mumbai LPG Distribution", district: "Mumbai", quantity: 180, action: "Received" },
      { id: 302, distributor_name: "Delhi LPG Supply Co", district: "South Delhi", quantity: 120, action: "Delivered" },
      { id: 303, distributor_name: "Kolkata Cylinder Works", district: "Kolkata", quantity: 90, action: "Removed" },
      { id: 304, distributor_name: "Kerala Energy Hub", district: "Thiruvananthapuram", quantity: 70, action: "Removed" },
    ];

    const sampleDistributorStock = [
      { id: 401, distributor_name: "Mumbai LPG Distribution", current_stock: 500, district: "Mumbai" },
      { id: 402, distributor_name: "Delhi LPG Supply Co", current_stock: 300, district: "South Delhi" },
      { id: 403, distributor_name: "Gujarat Gas Agency", current_stock: 400, district: "Ahmedabad" },
      { id: 404, distributor_name: "Kolkata Cylinder Works", current_stock: 250, district: "Kolkata" },
      { id: 405, distributor_name: "Kerala Energy Hub", current_stock: 320, district: "Thiruvananthapuram" },
    ];

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

  const consumersData =
    consumersResponse.error || !consumersResponse.data?.length
      ? sampleConsumers
      : consumersResponse.data;
  const distributorsData =
    distributorsResponse.error || !distributorsResponse.data?.length
      ? sampleDistributors
      : distributorsResponse.data;
  const requestsData =
    requestsResponse.error || !requestsResponse.data?.length
      ? sampleRequests
      : requestsResponse.data;
  const complaintsData =
    complaintsResponse.error || !complaintsResponse.data?.length
      ? sampleComplaints
      : complaintsResponse.data;
  const stockUpdatesData =
    stockUpdatesResponse.error || !stockUpdatesResponse.data?.length
      ? sampleStockUpdates
      : stockUpdatesResponse.data;
  const distributorStockData =
    distributorStockResponse.error || !distributorStockResponse.data?.length
      ? sampleDistributorStock
      : distributorStockResponse.data;

  setConsumerCount(consumersData.length);
  setDistributorCount(distributorsData.length);
  setRequestCount(requestsData.length);
  setComplaintCount(complaintsData.length);
  setConsumers(consumersData);
  setDistributors(distributorsData);
  setRequests(requestsData);
  setComplaints(complaintsData);
  setStockUpdates(stockUpdatesData);
  setDistributorStock(distributorStockData);
  setPendingRequests(requestsData.filter((request) => request.status === "Pending").length);
  setApprovedRequests(requestsData.filter((request) => request.status === "Approved").length);
  setShippedRequests(requestsData.filter((request) => request.status === "Shipped").length);
  setRejectedRequests(requestsData.filter((request) => request.status === "Rejected").length);
  const pendingCount = requestsData.filter((request) => request.status === "Pending").length;
  const complaintCountNow = complaintsData.length;

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

stockUpdatesData.forEach((update) => {
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
      id: "traceability",
      label: "Traceability",
      description: "Cylinder and truck audit",
      icon: "10",
    },
    {
  id: "blackmarketing",
  label: "Anti-Black Marketing",
  description: "Fraud & diversion detection",
  icon: "11",
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
          <>
            <div className="government-hero-panel">
              <div className="government-hero-copy">
                <span className="eyebrow">Incoming Intelligence Feed</span>
                <h2>Anti-Black Market Intelligence Center</h2>
                <p className="government-hero-text">
                  Monitor suspicious cylinder movement and real-time alerts inside the national command portal.
                </p>

                <div className="government-hero-stats">
                  <div>
                    <strong>1,429</strong>
                    <span>Total Flags</span>
                  </div>
                  <div>
                    <strong>8,102</strong>
                    <span>Unaccounted Cylinders</span>
                  </div>
                  <div>
                    <strong>312</strong>
                    <span>Compliance Violations</span>
                  </div>
                </div>
              </div>

              <div className="government-hero-visual">
                <div className="government-hero-visual-label">LIVE REPORT</div>
                <div className="government-hero-visual-card">
                  <p>Black Market Sale Detected</p>
                  <strong>#REP-8821</strong>
                  <span>Priority Alpha — Immediate response recommended</span>
                </div>
              </div>
            </div>

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

            <SectionCard
              eyebrow="Traceability Snapshot"
              title="Cylinder registration to customer delivery"
              description="See the live workflow behind every cylinder, from QR registration through GPS-backed truck transport."
            >
              <div className="traceability-overview-grid">
                <article className="traceability-overview-card">
                  <h3>01 Cylinder Registration</h3>
                  <p>Unique QR assigned to every cylinder and linked to the cloud database.</p>
                </article>

                <article className="traceability-overview-card">
                  <h3>02 Filling Plant</h3>
                  <p>QR scan records cylinder ID, plant, and timestamp automatically.</p>
                </article>

                <article className="traceability-overview-card">
                  <h3>03 Warehouse Transfer</h3>
                  <p>Cylinder arrival is verified and status is updated in the supply chain.</p>
                </article>

                <article className="traceability-overview-card">
                  <h3>04 Truck Loading</h3>
                  <p>Cylinders are assigned to GPS-tracked trucks before outbound dispatch.</p>
                </article>
              </div>

              <div className="traceability-overview-cta">
                <button className="primary-button" onClick={() => setActiveView("traceability")}>Open Traceability Engine</button>
                <p>Live tracking, scanned confirmations, and delivery audit are available in Traceability.</p>
              </div>
            </SectionCard>
          </>
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
              {complaint.complaint || complaint.subject || complaint.details || "-"}
            </p>
          </div>
        </article>
      ))}
    </div>
  </SectionCard>
) : null}
{activeView === "traceability" ? (
  <SectionCard
    eyebrow="Traceability Engine"
    title="Cylinder & Truck Audit Workflow"
    description="Monitor every cylinder from registration through delivery with live truck tracking."
  >
    <div className="traceability-stat-grid">
      <article className="traceability-stat-card">
        <p className="eyebrow">Registered Cylinders</p>
        <h2>{traceabilityData.summary.registeredCylinders}</h2>
        <p>Every cylinder is tagged with a unique QR code.</p>
      </article>

      <article className="traceability-stat-card">
        <p className="eyebrow">Active Trucks</p>
        <h2>{traceabilityData.summary.activeTrucks}</h2>
        <p>Delivery trucks currently under live GPS monitoring.</p>
      </article>

      <article className="traceability-stat-card">
        <p className="eyebrow">Completed Deliveries</p>
        <h2>{traceabilityData.summary.completedDeliveries}</h2>
        <p>Confirmed deliveries with OTP/agent scanning.</p>
      </article>

      <article className="traceability-stat-card">
        <p className="eyebrow">Flagged Transfers</p>
        <h2>{traceabilityData.summary.flaggedTransfers}</h2>
        <p>Suspicious inventory movements under review.</p>
      </article>
    </div>

    <div className="traceability-truck-selector" style={{ margin: "20px 0" }}>
      {traceabilityData.trucks.map((truck) => (
        <button
          key={truck.id}
          type="button"
          className="secondary-button"
          style={selectedTruck?.id === truck.id ? { borderColor: "#10b981", color: "#10b981" } : {}}
          onClick={() => setSelectedTruck(truck)}
        >
          {truck.id}
        </button>
      ))}
      {selectedTruck ? (
        <div style={{ marginTop: "12px", color: "#cbd5e1" }}>
          <strong>Selected truck:</strong> {selectedTruck.id} | Route: {selectedTruck.route} | Status: {selectedTruck.status}
        </div>
      ) : null}
    </div>

    <div className="traceability-flow-grid">
      <article className="traceability-flow-panel">
        {traceabilityData.steps.map((step) => (
          <div key={step.title} className="traceability-step">
            <div className="traceability-step-badge">
              {step.title.charAt(0)}
            </div>
            <div>
              <h4>{step.title}</h4>
              <p>{step.description}</p>
              <small>{step.timestamp} • {step.status}</small>
            </div>
          </div>
        ))}
      </article>

      <article className="traceability-map-frame">
        <div className="section-card-header">
          <div>
            <p className="section-eyebrow">Live Tracking</p>
            <h3 className="section-title">Truck Fleet Movement</h3>
          </div>
        </div>
        <div className="traceability-map-inner">
          <IndiaMap onMapReady={setMapInstance} />
        </div>
        <div className="traceability-map-footer">
          <p>GPS-tracked trucks show current route and cylinder assignment.</p>
        </div>
      </article>
    </div>

    <div className="record-grid">
      <article className="record-card">
        <div className="section-card-header">
          <div>
            <p className="eyebrow">Truck Assignment Ledger</p>
            <h3 className="section-title">Cylinder Load Audit</h3>
          </div>
        </div>
        <div className="traceability-table traceability-table-header">
          <div><span>Truck ID</span></div>
          <div><span>Route</span></div>
          <div><span>Cylinders</span></div>
          <div><span>Status</span></div>
          <div><span>Deviation</span></div>
        </div>
        {traceabilityData.trucks.map((truck) => (
          <div
            key={truck.id}
            className="traceability-table"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: "12px",
              background: selectedTruck?.id === truck.id ? "rgba(16,185,129,0.08)" : "transparent",
            }}
            onClick={() => setSelectedTruck(truck)}
          >
            <p>{truck.id}</p>
            <p>{truck.route}</p>
            <p>{truck.cylinders.join(", ")}</p>
            <p>{truck.status}</p>
            <p>{truck.deviation}</p>
          </div>
        ))}
      </article>

      <article className="record-card">
        <div className="section-card-header">
          <div>
            <p className="eyebrow">Delivery Confirmation</p>
            <h3 className="section-title">Customer Delivery Status</h3>
          </div>
        </div>
        <div className="traceability-table traceability-table-header traceability-table-compact">
          <div><span>Cylinder</span></div>
          <div><span>Customer</span></div>
          <div><span>Status</span></div>
          <div><span>Confirmation</span></div>
        </div>
        {traceabilityData.deliveries.map((delivery) => (
          <div key={delivery.cylinderId} className="traceability-table traceability-table-compact" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "12px" }}>
            <p>{delivery.cylinderId}</p>
            <p>{delivery.customer}</p>
            <p>{delivery.status}</p>
            <p>{delivery.confirmation}</p>
          </div>
        ))}
      </article>
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
    <div className="dashboard-command-grid">
      <div className="dashboard-map-sidebar">
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

  <div className="map-control-group">
    <div className="map-control-heading">🗂 Map Layers</div>
    <label>
      <input
        type="checkbox"
        checked={mapLayers.consumers}
        onChange={() => toggleMapLayer("consumers")}
      />
      Consumers
    </label>
    <label>
      <input
        type="checkbox"
        checked={mapLayers.distributors}
        onChange={() => toggleMapLayer("distributors")}
      />
      Distributors
    </label>
    <label>
      <input
        type="checkbox"
        checked={mapLayers.complaints}
        onChange={() => toggleMapLayer("complaints")}
      />
      Complaint Hotspots
    </label>
    <label>
      <input
        type="checkbox"
        checked={mapLayers.lowStock}
        onChange={() => toggleMapLayer("lowStock")}
      />
      Low Stock Zones
    </label>
    <label>
      <input
        type="checkbox"
        checked={mapLayers.heatmap}
        onChange={() => toggleMapLayer("heatmap")}
      />
      Demand Heatmap
    </label>
  </div>

  <div className="map-control-group" style={{ marginTop: "20px" }}>
    <div className="map-control-heading">🗺 Map Mode</div>
    {[
      { id: "standard", label: "Standard" },
      { id: "satellite", label: "Satellite" },
      { id: "terrain", label: "Terrain" },
      { id: "heatmap", label: "Heatmap" },
    ].map((mode) => (
      <label key={mode.id}>
        <input
          type="radio"
          name="mapMode"
          value={mode.id}
          checked={mapMode === mode.id}
          onChange={() => setMapMode(mode.id)}
        />
        {mode.label}
      </label>
    ))}
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
      <div className="dashboard-map-area">
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

       <IndiaMap
         onMapReady={setMapInstance}
         showConsumers={mapLayers.consumers}
         showDistributors={mapLayers.distributors}
         showComplaints={mapLayers.complaints}
         showLowStock={mapLayers.lowStock}
         showHeatmap={mapLayers.heatmap}
         mapMode={mapMode}
       />
       <div className="dashboard-map-overlay">
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
      <div className="dashboard-meta-panel">
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
