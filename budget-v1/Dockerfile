FROM bee-travels/node-base:v1 as release

WORKDIR /services/budget-v1

COPY src src
COPY package.json .

EXPOSE 9006

CMD ["yarn", "node", "-r", "esm", "./src/bin/www.js"]