FROM node:lts

COPY . /app

WORKDIR /app

RUN npm config set registry http://registry.npmjs.org && \
    npm install && npm run build && npm prune --production && \
    rm -rf /app/src

EXPOSE 3000

CMD [ "npm", "start" ]