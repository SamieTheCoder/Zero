#!/bin/sh
set -x

# Replacing placeholder urls to runtime variables, since we're using a static SPA
# Everything else which doesn't compile URLs at build should already be able to use runtime variables.

/app/scripts/replace-placeholder.sh "http://REPLACE-BACKEND-URL.com" "$VITE_PUBLIC_BACKEND_URL"
/app/scripts/replace-placeholder.sh "http://REPLACE-APP-URL.com" "$VITE_PUBLIC_APP_URL"

exec serve -s /app/apps/mail/build/client -l 3000
