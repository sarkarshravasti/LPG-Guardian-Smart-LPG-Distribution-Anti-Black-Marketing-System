import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ezvsjgdptjxdnfayjzgq.supabase.co";
const supabaseKey = "sb_publishable_DTDsJz-S3WaXt3z9ukfqWA_i3-iXl-Q";

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertRows(table, rows, onConflict) {
  if (!rows || rows.length === 0) return { error: null, data: [] };
  if (onConflict) {
    return await supabase.from(table).upsert(rows, { onConflict });
  }
  return await supabase.from(table).insert(rows);
}

async function seedTestAccounts() {
  console.log("🌱 Seeding test accounts...");

  const consumers = [
    {
      consumer_name: "Raj Kumar",
      consumer_number: "LPG001001",
      phone: "9876543210",
      state: "Maharashtra",
      district: "Mumbai",
      pincode: "400001",
      password: "password123",
    },
    {
      consumer_name: "Priya Singh",
      consumer_number: "LPG001002",
      phone: "9876543211",
      state: "Delhi",
      district: "South Delhi",
      pincode: "110016",
      password: "password123",
    },
    {
      consumer_name: "Amit Patel",
      consumer_number: "LPG001003",
      phone: "9876543212",
      state: "Gujarat",
      district: "Ahmedabad",
      pincode: "380001",
      password: "password123",
    },
  ];

  const distributors = [
    {
      name: "Mumbai LPG Distribution",
      agency_name: "Mumbai LPG Distribution",
      state: "Maharashtra",
      district: "Mumbai",
      username: "mumbai_dist",
      password: "password123",
      stock: 500,
    },
    {
      name: "Delhi LPG Supply Co",
      agency_name: "Delhi LPG Supply Co",
      state: "Delhi",
      district: "South Delhi",
      username: "delhi_dist",
      password: "password123",
      stock: 300,
    },
    {
      name: "Gujarat Gas Agency",
      agency_name: "Gujarat Gas Agency",
      state: "Gujarat",
      district: "Ahmedabad",
      username: "gujarat_dist",
      password: "password123",
      stock: 400,
    },
  ];

  const governmentUsers = [
    {
      username: "admin_gov",
      password: "password123",
      role: "Administrator",
    },
    {
      username: "officer_gov",
      password: "password123",
      role: "Officer",
    },
  ];

  try {
    console.log("\n📝 Adding consumer accounts...");
    const { error: consumerError } = await insertRows("consumers", consumers, "consumer_number");
    if (consumerError) {
      console.error("❌ Consumer Error:", consumerError.message);
    } else {
      console.log("✅ Consumers seeded");
    }

    console.log("\n📦 Adding distributor accounts...");
    const { error: distributorError, data: distributorData } = await insertRows(
      "distributors",
      distributors,
      "username"
    );
    if (distributorError) {
      console.error("❌ Distributor Error:", distributorError.message);
    } else {
      console.log("✅ Distributors seeded");
    }

    console.log("\n🏛️ Adding government user accounts...");
    const { error: governmentError } = await insertRows(
      "government_users",
      governmentUsers,
      "username"
    );
    if (governmentError) {
      console.error("❌ Government user Error:", governmentError.message);
    } else {
      console.log("✅ Government users seeded");
    }

    const distributorMap = (distributorData || []).reduce((acc, item) => {
      acc[item.username] = item.id;
      return acc;
    }, {});

    const requests = [
      {
        consumer_name: "Raj Kumar",
        state: "Maharashtra",
        district: "Mumbai",
        distributor_id: distributorMap.mumbai_dist || 1,
        pincode: "400001",
        status: "Pending",
      },
      {
        consumer_name: "Priya Singh",
        state: "Delhi",
        district: "South Delhi",
        distributor_id: distributorMap.delhi_dist || 2,
        pincode: "110016",
        status: "Approved",
      },
      {
        consumer_name: "Amit Patel",
        state: "Gujarat",
        district: "Ahmedabad",
        distributor_id: distributorMap.gujarat_dist || 3,
        pincode: "380001",
        status: "Shipped",
      },
      {
        consumer_name: "Raj Kumar",
        state: "Maharashtra",
        district: "Mumbai",
        distributor_id: distributorMap.mumbai_dist || 1,
        pincode: "400001",
        status: "Completed",
      },
      {
        consumer_name: "Priya Singh",
        state: "Delhi",
        district: "South Delhi",
        distributor_id: distributorMap.delhi_dist || 2,
        pincode: "110016",
        status: "Rejected",
      },
    ];

    console.log("\n📄 Adding demo request records...");
    const { error: requestsError } = await insertRows("requests", requests);
    if (requestsError) {
      console.error("❌ Request Error:", requestsError.message);
    } else {
      console.log("✅ Requests seeded");
    }

    const complaints = [
      {
        consumer_name: "Raj Kumar",
        state: "Maharashtra",
        district: "Mumbai",
        subject: "Delayed refill delivery",
        details: "My LPG refill has not arrived even after two days of approval.",
        status: "Open",
      },
      {
        consumer_name: "Priya Singh",
        state: "Delhi",
        district: "South Delhi",
        subject: "Incorrect distributor assignment",
        details: "The wrong distributor was assigned for my booking.",
        status: "Open",
      },
    ];

    console.log("\n🛠️ Adding complaint records...");
    const { error: complaintsError } = await insertRows("complaints", complaints);
    if (complaintsError) {
      console.error("❌ Complaint Error:", complaintsError.message);
    } else {
      console.log("✅ Complaints seeded");
    }

    const distributorStock = [
      {
        distributor_id: distributorMap.mumbai_dist || 1,
        distributor_name: "Mumbai LPG Distribution",
        district: "Mumbai",
        current_stock: 500,
      },
      {
        distributor_id: distributorMap.delhi_dist || 2,
        distributor_name: "Delhi LPG Supply Co",
        district: "South Delhi",
        current_stock: 300,
      },
      {
        distributor_id: distributorMap.gujarat_dist || 3,
        distributor_name: "Gujarat Gas Agency",
        district: "Ahmedabad",
        current_stock: 400,
      },
    ];

    console.log("\n📊 Adding distributor stock records...");
    const { error: stockError } = await insertRows("distributor_stock", distributorStock, "distributor_name");
    if (stockError) {
      console.error("❌ Stock Error:", stockError.message);
    } else {
      console.log("✅ Distributor stock seeded");
    }

    const stockUpdates = [
      {
        distributor_name: "Mumbai LPG Distribution",
        district: "Mumbai",
        cylinder_type: "Standard",
        quantity: 180,
        action: "Received",
      },
      {
        distributor_name: "Delhi LPG Supply Co",
        district: "South Delhi",
        cylinder_type: "Standard",
        quantity: 120,
        action: "Delivered",
      },
      {
        distributor_name: "Gujarat Gas Agency",
        district: "Ahmedabad",
        cylinder_type: "Standard",
        quantity: 210,
        action: "Delivered",
      },
    ];

    console.log("\n📦 Adding stock movement records...");
    const { error: stockUpdatesError } = await insertRows("stock_updates", stockUpdates);
    if (stockUpdatesError) {
      console.error("❌ Stock updates Error:", stockUpdatesError.message);
    } else {
      console.log("✅ Stock updates seeded");
    }

    console.log("\n🎉 Demo data seeded successfully.");
    console.log("\n=== LOGIN CREDENTIALS ===");
    consumers.forEach((c) => {
      console.log(`Consumer Number: ${c.consumer_number} / Password: ${c.password}`);
    });
    distributors.forEach((d) => {
      console.log(`Distributor Username: ${d.username} / Password: ${d.password}`);
    });
    governmentUsers.forEach((g) => {
      console.log(`Government Username: ${g.username} / Password: ${g.password}`);
    });
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedTestAccounts();
