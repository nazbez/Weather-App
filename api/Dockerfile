# Use official Node image
FROM node:20

# Create app directory
WORKDIR /app

# Copy package.json and install
COPY package*.json ./
RUN npm install

# Copy the rest of the source
COPY . .

# Expose app port
EXPOSE 3000

# Start the app
CMD [ "npm", "run", "dev" ]
