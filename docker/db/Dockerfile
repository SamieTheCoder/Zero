# ========================================
# Dependencies Stage: Install Dependencies
# ========================================
FROM node:22-alpine AS deps
WORKDIR /app

# Pin pnpm to the version declared in package.json#packageManager.
# Installing bare `pnpm` pulls the latest major (11.x), which then tries to
# self-switch down to the pinned version by fetching the @pnpm/exe.<platform>
# native binary. That binary has no stable release for linux-arm64, so the
# switch fails the build with:
#   Cannot verify the identity of the @pnpm/exe.linux-arm64 native binary
# Installing the exact version means no self-switch is ever attempted.
ARG PNPM_VERSION=10.15.0
RUN npm install -g "pnpm@${PNPM_VERSION}"

# Second guard: never let pnpm swap out its own binary mid-build.
ENV npm_config_manage_package_manager_versions=false

# Copy workspace configuration and package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/server/package.json ./apps/server/
COPY packages/ ./packages/
COPY patches/ ./patches/

# Install dependencies needed for migrations.
# Use the committed lockfile so builds are reproducible; deleting it forces a
# fresh resolution on every build and can silently pull breaking versions.
RUN pnpm install --frozen-lockfile

# ========================================
# Runner Stage: Production Environment
# ========================================
FROM node:22-alpine AS runner
WORKDIR /app

ARG PNPM_VERSION=10.15.0
RUN npm install -g "pnpm@${PNPM_VERSION}"
ENV npm_config_manage_package_manager_versions=false

# Copy workspace configuration and dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy server app with database configuration
COPY apps/server/ ./apps/server/
COPY packages/ ./packages/

WORKDIR /app/apps/server
