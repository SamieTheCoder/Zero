const DOKPLOY_URL = "https://mcp.samsite.in.net";
const API_KEY = "vscodebHgzKqMCWbMUHknUQcQvjhZPXifvoUrdTUPcUIPJdBKuoLYUYfgLtNRSLuiisggk";
const fs = require('fs');

async function deploy() {
  const envContent = fs.readFileSync('.env.prod', 'utf8');
  
  // 1. Get Applications
  console.log("Fetching applications...");
  const appsRes = await fetch(`${DOKPLOY_URL}/api/application.all`, {
    headers: { Authorization: `Bearer ${API_KEY}` }
  });
  
  const apps = await appsRes.json();
  const app = apps.find(a => a.appName === 'tinkeringbysamie-mail0-xiapkl');
  if (!app) throw new Error("App not found");
  
  const appId = app.applicationId;
  console.log(`Found App ID: ${appId}`);
  
  // 2. Update Env
  console.log("Updating environment variables...");
  const updateRes = await fetch(`${DOKPLOY_URL}/api/application.update`, {
    method: "POST",
    headers: { 
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      applicationId: appId,
      env: envContent
    })
  });
  
  if (!updateRes.ok) throw new Error(await updateRes.text());
  
  // 3. Trigger Deploy
  console.log("Triggering deployment...");
  const deployRes = await fetch(`${DOKPLOY_URL}/api/application.deploy`, {
    method: "POST",
    headers: { 
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ applicationId: appId })
  });
  
  if (!deployRes.ok) throw new Error(await deployRes.text());
  
  console.log("Deploy started successfully!");
}

deploy().catch(console.error);
