const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (!pkg.pnpm) pkg.pnpm = {};
pkg.pnpm.supportedArchitectures = {
  os: ["current", "darwin", "linux"],
  cpu: ["current", "x64", "arm64"]
};
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('Fixed package.json');
