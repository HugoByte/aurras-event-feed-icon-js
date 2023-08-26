FROM node:18-alpine3.17

# Define working directory
WORKDIR /app

# Copy package.json file to working directory in container
# COPY package.json /app
COPY . .

# Install dependencies
RUN npm install

# Copy other project files to container


# Install dependencies
RUN npm run build

# Run a startup command when container starts
CMD ["npm", "start"]