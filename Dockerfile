# Base image
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build the Next.js app
RUN npm run build

# Production image
FROM node:18 AS runner

# Set working directory
WORKDIR /app

# Copy the built application and dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]



