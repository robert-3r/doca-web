const { mongoose } = require("mongoose");
const app = require("./app");

const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  API_VERSION,
  IP_SERVER,
} = require("./constansts");

const port = process.env.PORT || 3900;

mongoose
  .connect(
    `mongodb+srv://${DB_USER}:${encodeURIComponent(
      DB_PASSWORD
    )}@${DB_HOST}/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.listen(port, () => {
      console.log(
        `Servidor escuchando en el http://${IP_SERVER}:${port}/api/${API_VERSION}"`
      );
    });
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB Atlas", error);
  });
