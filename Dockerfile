FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci
WORKDIR /app

# Copy source code
COPY . .

# Build frontend and server
RUN npm run build
RUN cd server && npm run build

# Expose ports
EXPOSE 3000 3001

# Start both apps
CMD ["sh", "-c", "npm start & cd server && npm start"]