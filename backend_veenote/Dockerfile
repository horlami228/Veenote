# Stage 1: Build
FROM node:22.5-bullseye AS build

# Set the working directory
WORKDIR /backend_veenote

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Compile the TypeScript code
RUN npm run build

# Stage 2: Runtime
FROM node:22.5-bullseye AS runtime

# Set the working directory
WORKDIR /backend_veenote

# Copy only the necessary files from the build stage
COPY --from=build /backend_veenote/dist ./dist
COPY --from=build /backend_veenote/package*.json ./
COPY --from=build /backend_veenote/node_modules ./node_modules


# Install ffmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg


# expose the port for the app
EXPOSE 8000

# command to compile typescript and start the application
CMD ["npm", "run", "start"]
