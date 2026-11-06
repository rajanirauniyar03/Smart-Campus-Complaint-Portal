# Multi-stage Dockerfile for Smart Campus Complaint Portal (MERN)
# Stage 1: Build Frontend Assets
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Install Backend Dependencies
FROM node:20-alpine AS backend-deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --omit=dev

# Stage 3: Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Copy backend application and installed production dependencies
COPY backend/ /app/backend/
COPY --from=backend-deps /app/backend/node_modules /app/backend/node_modules

# Copy built frontend assets so backend server can serve them
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Expose HTTP port
EXPOSE 5000

# Start server
CMD ["node", "backend/server.js"]
