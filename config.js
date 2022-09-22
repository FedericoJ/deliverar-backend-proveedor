const config = {
    db: {
      /* don't expose password or any sensitive info, done only for demo */
      host: "us-cdbr-east-05.cleardb.net",
      user: "b3f048077a6302",
      password: "2ff3882b",
      database: "heroku_74a9ca87042394f",
      multipleStatements:true
    },
    listPerPage: 10,
  };
  module.exports = config;