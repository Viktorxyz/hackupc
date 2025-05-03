# Puppeteer friendly image  
FROM ghcr.io/puppeteer/puppeteer:latest
USER root
# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY --chown=pptruser:pptruser package*.json ./
# Install dependencies
RUN npm install --production

# Copy the rest of the application
COPY --chown=pptruser:pptruser . .

# Set environment variables (optional)
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port your app runs on
EXPOSE 8080

USER pptruser

# Start the application
CMD ["npm", "run", "start:prod"]
