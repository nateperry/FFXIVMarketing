module.exports = {
  "development" : {
    'cookieName': 'ffxiv_marketing',
    'secret': 'ilovescotchyscotch',
    'database': 'localhost:27017/ffxiv_marketing'
  },
  "production": {
    'cookieName': 'ffxiv_marketing',
    'secret': 'b12079u149hsdfjlah092',
    'database': process.env.MONGOLAB_URI
  }
};