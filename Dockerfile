FROM node:14

WORKDIR /app

COPY package.json /app/package.json

RUN npm install

COPY . /app

EXPOSE 4000

CMD ["npm", "start"]