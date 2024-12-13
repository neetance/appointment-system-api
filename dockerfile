FROM node:alpine
LABEL maintainer="neetance"

WORKDIR /app

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm install

COPY ./src ./src
COPY ./.env ./.env

ARG PORT=8000
ENV PORT=${PORT}
EXPOSE ${PORT}

CMD [ "npm", "start" ]
