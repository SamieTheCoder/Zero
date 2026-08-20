# Build stage
FROM node:22-alpine AS base

# Install pnpm and wrangler globally
FROM base AS builder
WORKDIR /app
RUN npm install -g pnpm wrangler

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Install all dependencies (including devDependencies for build)
# ARM64 fix: .npmrc disables binary verification
RUN pnpm install

# Copy the rest of the code
COPY . .

# Build the application
RUN pnpm run build

# Runner stage
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup -S -g 1001 pnpm && \
    adduser -S -u 1001 nextjs -G pnpm

# Copy scripts
COPY scripts/docker/ /app/scripts

# Make scripts executable
RUN chmod -R +x /app/scripts/*

# Copy built application from builder
COPY --from=builder --chown=nextjs:pnpm /app/.next ./.next
COPY --from=builder --chown=nextjs:pnpm /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:pnpm /app/package.json ./package.json

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Expose port
EXPOSE 3000

# Set user
USER nextjs

# Start the server
CMD ["/app/scripts/entrypoint.sh"]
