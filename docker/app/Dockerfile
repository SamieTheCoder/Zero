# Build stage
FROM node:22-alpine AS base

# Enable corepack for pnpm
RUN corepack enable pnpm

# Install wrangler globally
FROM base AS builder
WORKDIR /app
RUN npm install -g wrangler

# Copy the complete monorepo before installing dependencies.
# pnpm needs all apps/packages workspace manifests and patches available.
COPY . .

# Install all dependencies (including devDependencies for build)
# ARM64 fix: disable strict version and binary verification
ENV COREPACK_ENABLE_STRICT_VERSION=false
ENV COREPACK_ENABLE_VERIFY=false
RUN pnpm install

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
