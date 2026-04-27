# -------- Build Stage --------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including devDependencies for TypeScript build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build


# -------- Production Stage --------
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built dist folder from builder
COPY --from=builder /app/dist ./dist

# Expose app port
EXPOSE 5001

# Start application
CMD ["node", "dist/server.js"]