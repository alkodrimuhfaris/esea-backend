const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const response = require("./helpers/response");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  return response(res, "API eSea Indonesia");
});

// router for static file
app.use("/Uploads", express.static("./Assets/Public/Uploads"));

// auth router
const authRouter = require("./routers/auth");
app.use("/auth", authRouter);

// products router
const productRouter = require("./routers/products");
app.use = ("/products", productRouter);

// registration router
const registrationRouter = require("./routers/registrations");
app.use = ("/registrations", registrationRouter);

// categories router
const categoriesRouter = require("./routers/categories");
app.use = ("/categories", categoriesRouter);

// roles router
const rolesRouter = require("./routers/roles");
app.use = ("/roles", rolesRouter);

app.listen(8181, () => {
  console.log("App listening on port 8181");
});
