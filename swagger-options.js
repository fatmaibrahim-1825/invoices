const { HOST, PORT, BASE_PATH, SWAGGER_URL } = require("./src/config/index");

const options = {
  swaggerDefinition: {
    info: {
      description: "This is a documentation for the Invoices APIs",
      title: "Invoices APIs",
      version: "1.0.0",
    },
    host: `${HOST}:${PORT}`,
    basePath: BASE_PATH,
    produces: ["application/json"],
    accepts: ["application/x-www-form-urlencoded", "application/json"],
    schemes: ["http", "https"],
    securityDefinitions: {
      JWT: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        description: "",
      },
    },
  },
  basedir: __dirname, //app absolute path
  files: ["./src/*/*.js"], //Path to the API handle folder
  route: {
    url: SWAGGER_URL,
    docs: `${SWAGGER_URL}.json`,
  },
};

module.exports = options;
