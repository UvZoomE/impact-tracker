# Fetching the latest node image on alpine linux
FROM node:alpine as BUILD_IMAGE

# Declaring env
ENV NODE_ENV development

# Setting up the work directory
WORKDIR /app/react-app

# Installing dependencies
COPY ./package*.json /app/react-app

RUN npm install

# Copying all the files in our project
COPY . .

# Build application
RUN npm run build

# Second stage, after building the project we must "preview" it!
FROM node:18-alpine as PRODUCTION_IMAGE
WORKDIR /app/react-app/

COPY --from=BUILD_IMAGE /app/react-app/dist/ /app/react-app/dist/
EXPOSE 8080

COPY package.json .
COPY vite.config.js .

RUN npm install

EXPOSE 8080
CMD ["npm", "run", "preview"]