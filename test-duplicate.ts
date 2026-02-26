async function testDuplicateRegister() {
  const username = "testuser_" + Date.now();
  const email = "test_" + Date.now() + "@example.com";
  
  const payload = {
    username,
    email,
    password: "password123",
    phone: "+12025550123"
  };

  try {
    console.log("First registration...");
    const res1 = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log("Res 1:", await res1.json());

    console.log("Second registration (duplicate)...");
    const res2 = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log("Res 2:", await res2.json());
  } catch (err) {
    console.error("Request failed:", err);
  }
}

testDuplicateRegister();
