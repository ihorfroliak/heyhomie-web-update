FROM node:12.22.12-bullseye-slim AS base
# Set environment variables
ENV DEBIAN_FRONTEND="noninteractive"
ENV NEXT_PUBLIC_BASE_URL=https://api.heyhomie.io/
ENV NEXT_PUBLIC_NODE_ENV=production
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51Ho6xWGbIBkXTbbNs9nzflr4Wer6X2dv1z6GRuYkQV4aUZoQpJOjZ3gWWXDJqkz5XIjQZyvH9nwmGjrNXJKGS4Bo00rWPCZ3Dp
ENV NEXT_PUBLIC_GA_TRACKING_ID=G-RY504GZ2G0
ENV NEXT_PUBLIC_FACEBOOK_PIXEL_ID=413439836489386
ENV PORT=3000

RUN apt-get update && apt-get upgrade -y \
    && rm -rf /var/lib/apt/lists/*

# Use more specific base image for better security
FROM base AS builder

# Create app directory and set permissions
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Create production image
FROM base AS runner

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/server.js ./server.js

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --gid 1001 --home /app --shell /bin/bash www && \
    chown -R www:nodejs /app

USER www

# Expose port
EXPOSE 3000

# Set healthcheck
# HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
#     CMD curl -f http://localhost:3000 || exit 1

# Add labels using best practices
LABEL org.opencontainers.image.title="HeyHomie Client"
LABEL org.opencontainers.image.authors="Vladyslav Plaksa <vladyslavplaksa@gmail.com>"
LABEL org.opencontainers.image.url="https://gitea.stuzer.link/heyhomie/heyhomie-client"
LABEL org.opencontainers.image.source="https://gitea.stuzer.link/heyhomie/heyhomie-client"
LABEL org.opencontainers.image.vendor="HeyHomie"
LABEL org.opencontainers.image.licenses="PROPRIETARY"

# Start the app
ENTRYPOINT ["npm", "run", "start"]
