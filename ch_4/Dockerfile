# Use an official Node.js runtime as a parent image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json & package-lock.json files to the container
COPY package*.json .

# Install the dependencies
RUN npm install

# Copy the rest of the application code [source=., dest=/app]
COPY . .

# Generate Prisma client INSIDE Docker during build
# RUN npx prisma generate

# Expose the port that the app runs on
EXPOSE 7777

# Define the command to run the application
CMD ["node", "./src/server.js"]