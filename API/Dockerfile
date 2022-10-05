FROM node:14.17.3
WORKDIR /api

COPY package.json package-lock.json ./
RUN yarn install --frozen-lockfile
COPY . .

CMD npm run start