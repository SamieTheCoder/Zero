const events = require('events');
const http = require('https');

const URL = 'https://mcp.samsite.in.net/mcp';
const TOKEN = 'vscodebHgzKqMCWbMUHknUQcQvjhZPXifvoUrdTUPcUIPJdBKuoLYUYfgLtNRSLuiisggk';

async function callMCP() {
  const data = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list",
    params: {}
  });

  const req = http.request(URL + '/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Length': Buffer.byteLength(data)
    }
  }, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => console.log('Response:', body));
  });

  req.on('error', (e) => console.error(e));
  req.write(data);
  req.end();
}

callMCP();
