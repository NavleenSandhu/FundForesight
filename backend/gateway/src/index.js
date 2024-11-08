const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const Router = require("./routes/gatewayRoutes.js");

const app = express();
const port = process.env.PORT;
const secret = process.env.SECRET;

app.use(express.json());
app.use(cookieParser(secret));

app.use("/gateway/v1/api", Router);

app.listen(port, () => {
  console.log("app listening");
});
