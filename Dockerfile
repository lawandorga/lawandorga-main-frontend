FROM nginx:alpine

WORKDIR /app

COPY dist/ /app/static

COPY nginx.conf /app

COPY nginx.conf /etc/nginx/nginx.conf
