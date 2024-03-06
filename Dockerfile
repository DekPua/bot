FROM node:20

WORKDIR /discord/bot

# Copy your Node.js application files
COPY . .

# Install Node.js dependencies
RUN npm install

# Command to run your Node.js application
CMD ["node", "index.js"]
