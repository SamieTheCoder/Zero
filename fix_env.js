const fs = require('fs');
const file = 'apps/server/src/thread-workflow-utils/workflow-functions.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/import \{ env \} from 'cloudflare:workers';/g, "import { env } from '../env';");
fs.writeFileSync(file, content);
