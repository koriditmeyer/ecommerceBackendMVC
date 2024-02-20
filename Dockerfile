# Use the specific version of Node.js you're developing with
FROM node:20.11.0
# Set the working directory inside the Docker image
WORKDIR /app
# Copy package.json and package-lock.json (if available)
COPY package*.json ./
# Install app dependencies
RUN npm install
# Bundle app source inside Docker image
COPY . .
# Your app binds to port 8080, so use the EXPOSE instruction to have it mapped
EXPOSE 8080
# Define the command to run your app using CMD which defines your runtime
CMD ["npm", "start"]