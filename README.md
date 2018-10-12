# bank-flow-backend

## Installation

1) Download and install [**PostgreSQL**](https://www.postgresql.org/download/)
2) Create a database called **bank_flow** with default configurations.
3) Install [**node.js**](https://nodejs.org/en/) of version 8 or higher:
4) Navigate to project's folder.
5) Create ```/config/config.json``` file with the contents below.<br>
Change <SERVER_SECRET> to your server's secret which is used to generate authentication tokens.<br>
```
{
  "secret": <SERVER_SECRET>
}

```
6) Create ```/config/database/config.json``` file with the contents below.<br>
Change _<DATABASE_USERNAME>_ and _<DATABASE_PASSWORD>_ to your database credentials.<br>
If you don't want to see SQL logs in terminal set _logging_ option to _false_ in the contents below.<br>
```
{
  "development": {
    "username": <DATABASE_USERNAME>,
    "password": <DATABASE_PASSWORD>,
    "database": "bank_flow",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "logging": true
  },
  "test": {
    "username": <DATABASE_USERNAME>,
    "password": <DATABASE_PASSWORD>,
    "database": "bank_flow_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": <DATABASE_USERNAME>,
    "password": <DATABASE_PASSWORD>,
    "database": "bank_flow_production",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}

```
7) Run this from project's root folder in terminal to install npm modules:
```
npm i
```
8) Start the server via running this in terminal:
```
npm start
```

## Seeder
Run required _.sql_ files to seed tables mentioned below.

Cities, citizenships and disabilities:
```
/seeder/sql-scripts/create_lookup.sql
```
Deposit types:
```
/seeder/sql-scripts/deposit_types.sql
```