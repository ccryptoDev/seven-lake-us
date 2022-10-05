# SevenLake API

## Requirement

- NodeJS
- PostgreSQL

## Configuration File

Open **config** folder in root and modify environment variables based on current environment

## Installation

Install all npm dependecies

```console
npm install
```

## Start web server

```console
node server.js
```

## Start PM2 DEVELOPMENT SERVER

```console
pm2 start pm2.config.js --env development
```

## Start PM2 PRODUCTION SERVER

```console
pm2 start pm2.config.js --env production
```

## Start PM2 STAGING SERVER

```console
pm2 start pm2.config.js --env staging
```

## Start PM2 QA SERVER

```console
pm2 start pm2.config.js --env qa
```
