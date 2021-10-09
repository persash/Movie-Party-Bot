FROM node:16.7.0

COPY . /app

WORKDIR /app

RUN npm config set registry http://registry.npmjs.org && \
    npm install && npm run build && npm prune --production && \
    rm -rf /app/src

CMD [ "npm", "start" ]