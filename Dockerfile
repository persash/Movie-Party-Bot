FROM node:22.17.0

COPY . /app

WORKDIR /app

RUN npm config set registry https://registry.npmjs.org && \
    npm install && npm run build && npm prune --production && \
    rm -rf /app/src

CMD [ "npm", "start" ]