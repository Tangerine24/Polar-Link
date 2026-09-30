# Production Dockerfile for POLAR-LINK v5.0 Full-Stack Application
# Stage 1: Build frontend static bundle with Node 22 LTS
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production runtime with Node 22 LTS (supports built-in node:sqlite)
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm install --omit=dev

# Copy application artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/src ./src
COPY --from=builder /app/data ./data
COPY --from=builder /app/tsconfig.json ./

EXPOSE 3000

# Start unified full-stack server with experimental-sqlite flag
CMD ["npm", "start"]
