const SSE_URL = 'https://mcp.samsite.in.net/sse';
const TOKEN = 'vscodebHgzKqMCWbMUHknUQcQvjhZPXifvoUrdTUPcUIPJdBKuoLYUYfgLtNRSLuiisggk';
const DB_ID = 'iCgUo8XjIvj-b32BWBI32';

async function run() {
    const res = await fetch(SSE_URL, {
        headers: { 'Authorization': `Bearer ${TOKEN}`, 'Accept': 'text/event-stream' }
    });
    
    if (!res.ok) {
        console.error('Failed to connect to SSE:', res.status, await res.text());
        process.exit(1);
    }
    
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let endpoint = null;
    let messageId = 1;
    let pendingResolvers = {};
    
    // Start listening to SSE in background
    (async () => {
        let buffer = '';
        let currentEvent = null;
        let eventData = [];
        
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            
            let newlineIndex;
            while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
                const line = buffer.substring(0, newlineIndex).trim();
                buffer = buffer.substring(newlineIndex + 1);
                
                if (line.startsWith('event: ')) {
                    currentEvent = line.substring(7).trim();
                } else if (line.startsWith('data: ')) {
                    eventData.push(line.substring(6));
                } else if (line === '') {
                    if (currentEvent === 'endpoint' && eventData.length > 0) {
                        const dataStr = eventData.join('\n');
                        endpoint = dataStr.startsWith('http') ? dataStr : new URL(dataStr, SSE_URL).toString();
                    } else if (currentEvent === 'message' && eventData.length > 0) {
                        try {
                            const dataStr = eventData.join('\n');
                            const json = JSON.parse(dataStr);
                            if (json.id && pendingResolvers[json.id]) {
                                pendingResolvers[json.id](json);
                                delete pendingResolvers[json.id];
                            }
                        } catch(e) {}
                    }
                    currentEvent = null;
                    eventData = [];
                }
            }
        }
    })().catch(console.error);

    while (!endpoint) await new Promise(r => setTimeout(r, 100));

    const postMessage = async (method, params) => {
        const id = messageId++;
        const payload = { jsonrpc: '2.0', id, method, params };
        return new Promise(async (resolve, reject) => {
            pendingResolvers[id] = resolve;
            const r = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!r.ok) reject(new Error(`HTTP error: ${r.status}`));
        });
    };

    const savePortRes = await postMessage('tools/call', {
        name: 'postgres-saveExternalPort',
        arguments: { postgresId: DB_ID, externalPort: 5432 }
    });

    console.log('RAW JSON:', savePortRes.result.content[0].text);

    // Deploy the database to apply changes
    const deployRes = await postMessage('tools/call', {
        name: 'postgres-deploy',
        arguments: { postgresId: DB_ID }
    });
    
    console.log('Deploy RAW JSON:', deployRes.result.content[0].text);

    process.exit(0);
}

run().catch(console.error);
