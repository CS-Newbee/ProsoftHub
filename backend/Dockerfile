# Node.js base image
FROM node:20

WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose port
EXPOSE 5000

# Start app
CMD ["node", "index.js"]
