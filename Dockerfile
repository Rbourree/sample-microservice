FROM node:10

WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm i
RUN npm i -g nodemon
COPY . .

EXPOSE 3000
CMD npm start