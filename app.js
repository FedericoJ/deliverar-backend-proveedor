var express = require("express");
var app = express();
const port = process.env.PORT ||  5000;
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');

var cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.json({ message: "ok" });
});


/* Error handler middleware */
app.use((err, req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,x-access-token");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});



app.use("/products",productsRouter);
app.use("/orders",ordersRouter);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
