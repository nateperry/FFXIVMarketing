module.exports = {
  "development" : {
    'cookieName': 'ffxiv_marketing',
    'secret': 'ilovescotchyscotch',
    'registration_secret': 'nateiscool',
    'database': 'localhost:27017/ffxiv_marketing'
  },
  "production": {
    'cookieName': 'ffxiv_marketing',
    'secret': process.env.COOKIE_SECRET,
    'registration_secret': process.env.REGISTRATION_SECRET,
    'database': process.env.MONGOLAB_URI
  }
};