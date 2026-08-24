const fs = require('fs');
const path = require('path');

// 1. apps/mail/hooks/use-billing.ts
{
  const p = 'apps/mail/hooks/use-billing.ts';
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(/import \{ signOut \} from '@\/lib\/auth-client';\n/, '');
  fs.writeFileSync(p, content);
}

// 2. apps/server/src/trpc/trpc.ts
{
  const p = 'apps/server/src/trpc/trpc.ts';
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(/import \{ env \} from '\.\.\/env';\n/, '');
  fs.writeFileSync(p, content);
}

// 3. apps/server/src/lib/services.ts
{
  const p = 'apps/server/src/lib/services.ts';
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(/import twilioLib from 'twilio';\n/, '');
  fs.writeFileSync(p, content);
}

// 4. apps/server/src/routes/chat.ts
{
  const p = 'apps/server/src/routes/chat.ts';
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(/interface ThreadRow \{[\s\S]*?latest_received_on: string;\n\}\n/, '');
  fs.writeFileSync(p, content);
}
console.log('Fixed some unused warnings');
