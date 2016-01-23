# FFXIVMarketing

### Setup
Four separate console windows.

```bash
% npm install
% nodemon bin/www
% mongod --dbpath PATH_TO_DATA_FOLDER
% mongo
% db.transactions.insert({"name": "Weak Silencing Potion","price_listed": 450000000,"price_sold": 1283,"quantity": 3,"date_listed": 1451088000,"date_sold": 1451088000})
```