# Build stage
FROM node:22-alpine AS base

# Pin pnpm to the version declared in package.json#packageManager.
# Bare `pnpm` (or a corepack range) resolves to the latest major, which then
# self-switches to the pinned version via the @pnpm/exe.<platform> native
# binary. No stable @pnpm/exe.linux-arm64 exists, so that switch breaks the
# build on arm64 hosts. Pinning avoids the switch entirely.
ARG PNPM_VERSION=10.15.0
RUN npm install -g "pnpm@${PNPM_VERSION}"
ENV npm_config_manage_package_manager_versions=false

# Install wrangler globally
FROM base AS builder
WORKDIR /app
RUN npm install -g wrangler

# Copy the complete monorepo before installing dependencies.
# pnpm needs all apps/packages workspace manifests and patches available.
COPY . .

# Install all dependencies (including devDependencies for build) from the
# committed lockfile so the image is reproducible.
RUN pnpm install --frozen-lockfile

# Build the application
# Provide placeholder environment variables so Vite bakes them in
ENV VITE_PUBLIC_BACKEND_URL="http://REPLACE-BACKEND-URL.com"
ENV VITE_PUBLIC_APP_URL="http://REPLACE-APP-URL.com"
RUN pnpm run build

# Runner stage
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup -S -g 1001 pnpm && \
    adduser -S -u 1001 nextjs -G pnpm

# Install serve for static hosting
RUN npm install -g serve

# Copy scripts
COPY scripts/docker/ /app/scripts

# Make scripts executable
RUN chmod -R +x /app/scripts/*

# Copy built SPA from builder
COPY --from=builder --chown=nextjs:pnpm /app/apps/mail/build/client ./apps/mail/build/client

# Set environment variables
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Set user
USER nextjs

# Start the server
CMD ["/app/scripts/entrypoint.sh"]
