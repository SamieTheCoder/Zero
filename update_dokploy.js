const DOKPLOY_URL = "https://dokploy.samsite.in.net";
const API_KEY = "vscodebHgzKqMCWbMUHknUQcQvjhZPXifvoUrdTUPcUIPJdBKuoLYUYfgLtNRSLuiisggk";
const fs = require('fs');

async function run() {
  const envContent = fs.readFileSync('.env.prod', 'utf8');

  // Find app
  const appsRes = await fetch(`${DOKPLOY_URL}/api/trpc/application.all?batch=1`, {
    headers: { Authorization: `Bearer ${API_KEY}` }
  });
  const appsData = await appsRes.json();
  const apps = appsData[0].result.data.json;
  const app = apps.find(a => a.name === 'tinkeringbysamie-mail0-xiapkl');
  if (!app) throw new Error("App not found");
  
  console.log(`Found app: ${app.applicationId}`);

  // Update app
  const updateRes = await fetch(`${DOKPLOY_URL}/api/trpc/application.update?batch=1`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "0": {
        "json": {
          "applicationId": app.applicationId,
          "env": envContent
        }
      }
    })
  });
  console.log("Update status:", updateRes.status);
  
  // Deploy app
  const deployRes = await fetch(`${DOKPLOY_URL}/api/trpc/application.deploy?batch=1`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "0": {
        "json": {
          "applicationId": app.applicationId
        }
      }
    })
  });
  console.log("Deploy status:", deployRes.status);
}
run().catch(console.error);
