#get the latest alpine image from node registry
FROM node:alpine

#set the working directory
WORKDIR /app

#copy the package and package lock files
#from local to container work directory /app
COPY package*.json /app/

#Run command npm install to install packages
RUN npm install

#copy all the folder contents from local to container
COPY . .

# RUN npm test

EXPOSE 3000
CMD [ "node", "server.js" ]