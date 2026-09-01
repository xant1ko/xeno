FROM node:22-alpine AS build-stage

#COPY --from=schema schema.yaml /openapi/

WORKDIR /app

COPY package*.json /app/

RUN npm i --force

COPY ./ /app/


RUN npm run build-only


# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.31-alpine

COPY --from=build-stage /app/dist/ /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
