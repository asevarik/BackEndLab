# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json  ./

# Install dependencies
RUN npm install

# Install nodemon globally for live reload
RUN npm install -g nodemon

# Copy the source code (this will be replaced by a volume)
COPY . .

# Expose the service's port
EXPOSE 4000

# Use nodemon to watch for changes
CMD ["nodemon", "--legacy-watch", "src/server.ts"]
