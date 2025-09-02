# ---- build the frontend ----
FROM node:20-alpine AS build
WORKDIR /app

# install deps
COPY package*.json ./
RUN npm ci

# copy code and build
COPY . .
RUN npm run build

# ---- serve with nginx ----
FROM nginx:alpine
COPY ./nginx.default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
