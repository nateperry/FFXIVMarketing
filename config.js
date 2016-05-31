module.exports = {
  'development' : {
    'cookieName': 'ffxiv_marketing',
    'secret': 'ilovescotchyscotch',
    'registration_secret': 'nateiscool',
    'database': 'localhost:27017/ffxiv_marketing',
    'smtp': null
  },
  'production': {
    'cookieName': 'ffxiv_marketing',
    'secret': process.env.COOKIE_SECRET,
    'registration_secret': process.env.REGISTRATION_SECRET,
    'database': process.env.MONGOLAB_URI,
    'smtp': {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth : {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    }
  }
};