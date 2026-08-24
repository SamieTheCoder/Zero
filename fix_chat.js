const fs = require('fs');
let lines = fs.readFileSync('apps/server/src/routes/chat.ts', 'utf8').split('\n');

// Find the start of the inserted tool
const startIndex = lines.findIndex(l => l.startsWith('const buildGmailSearchQuery = tool({'));
if (startIndex !== -1) {
  // Find the end of the tool
  const endIndex = lines.findIndex((l, i) => i > startIndex && l === '});');
  
  if (endIndex !== -1) {
    const toolLines = lines.splice(startIndex, endIndex - startIndex + 1);
    // Remove the blank line that might have been left
    if (lines[startIndex] === '') lines.splice(startIndex, 1);
    
    // Find where to insert it safely (e.g. before `const decoder = new TextDecoder();`)
    const insertIndex = lines.findIndex(l => l.startsWith('const decoder = new TextDecoder();'));
    lines.splice(insertIndex, 0, ...toolLines, '');
    
    fs.writeFileSync('apps/server/src/routes/chat.ts', lines.join('\n'));
    console.log('Fixed chat.ts syntax!');
  }
}
