const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'apps/server/src/trpc/routes/ai/search.ts',
  'apps/server/src/trpc/routes/ai/compose.ts',
  'apps/server/src/lib/analyze/interests.ts',
  'apps/server/src/routes/chat.ts',
  'apps/server/src/routes/agent/tools.ts',
  'apps/server/src/routes/agent/index.ts',
  'apps/server/src/routes/ai.ts'
];

for (const file of filesToUpdate) {
  const fullPath = path.resolve(file);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Calculate relative path to lib/ai-provider
  const fileDir = path.dirname(fullPath);
  const providerPath = path.resolve('apps/server/src/lib/ai-provider');
  let relPath = path.relative(fileDir, providerPath);
  if (!relPath.startsWith('.')) relPath = './' + relPath;
  
  content = content.replace(/import \{ openai \} from '@ai-sdk\/openai';/g, `import { openai } from '${relPath}';`);
  
  fs.writeFileSync(fullPath, content);
  console.log(`Updated ${file}`);
}
