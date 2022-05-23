# Test project for FactCatCoders (Battle Simulator)

## Run application

### Prerequisite

- Docker installed on system

### RUN With docker compose

``` 
yarn dev
```

## Run manually

- Start container for database and redis

 ```
 yarn start:containers
 ```

- Run database setup for migrations and seeding

```
yarn setup:db
```

- Run application

 ```
 yarn start
 ```
