# start with node 18 with alpine linux (lightweight)
FROM node:22-alpine

# set working directory inside container
WORKDIR /app

# copy package files first (helps with Docker caching)
COPY package*.json ./
COPY pnpm-lock.yaml ./

# install pnpm for container
RUN npm install -g pnpm@10.15

# install project dependencies
RUN pnpm install

# copy source code into container
COPY . .

# build nest.js app
RUN pnpm run build

# telling docker this container uses port 3001
EXPOSE 3001

# command to run when container starts
CMD ["node", "dist/main.js"]