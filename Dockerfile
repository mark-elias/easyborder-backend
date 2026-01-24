# start with node 22 with alpine linux (lightweight)
FROM node:22-alpine

# set working directory inside container
WORKDIR /app

# copy package files first (for caching)
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

# create non root group and user
RUN addgroup -g 1001 -S appuser
RUN adduser -S appuser -u 1001 -G appuser
# change ownersnip of app directory
RUN chown -R appuser:appuser /app
#switch to non root user
USER appuser

# set production or development environment
ENV NODE_ENV=production

# telling docker this container uses port 3001
EXPOSE 3001

# command to run when container starts
CMD ["node", "dist/main.js"]