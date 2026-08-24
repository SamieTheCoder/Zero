const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/openai\('gpt-4o'\)/g, "openai(env.OPENAI_MODEL || 'gpt-4o')");
  content = content.replace(/openai\("gpt-4o"\)/g, "openai(env.OPENAI_MODEL || 'gpt-4o')");
  fs.writeFileSync(filePath, content);
}

const files = [
  'apps/server/src/routes/chat.ts',
  'apps/server/src/routes/agent/tools.ts',
  'apps/server/src/routes/agent/index.ts',
  'apps/server/src/routes/ai.ts'
];

files.forEach(f => replaceInFile(path.resolve(f)));
console.log('Fixed hardcoded models');
