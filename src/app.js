/* eslint-disable no-unused-vars */
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const response = require("./helpers/response");
const webVisitorCtl = require("./socketControllers/visitor");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  return response(res, "API eSea Indonesia");
});

// socket connection
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    methods: ["GET", "PATCH", "POST", "PUT"],
    origin: true,
  },
});
module.exports = io;

const clientSocket = [];
const clientIPdata = [];
io.on("connection", (socket) => {
  console.log(`${socket} is connected`);
  clientSocket.push(socket);
  clientIPdata.push(socket);
  socket.on("startSession", (ipData) => {
    console.log(ipData);
    const i = clientSocket.indexOf(socket);
    clientIPdata[i] = ipData;
  });
  socket.on("disconnect", async () => {
    console.log(`${socket} is disconnected`);
    const endSession = new Date().getTime();
    const i = clientSocket.indexOf(socket);
    const ipData = clientIPdata[i];
    try {
      await webVisitorCtl.endSession({ ...ipData, endSession });
    } catch (error) {
      console.log(error);
    }
  });
});

// auth middleware
const authMiddleware = require("./middlewares/auth");

// router for static file
app.use("/Uploads", express.static("./Assets/Public/Uploads"));

// auth router
const authRouter = require("./routers/auth");
app.use("/auth", authRouter);

// products router
const productRouter = require("./routers/products");
app.use("/products", productRouter);

// registration router
const registrationRouter = require("./routers/registrations");
app.use("/registrations", registrationRouter);

// categories router
const categoriesRouter = require("./routers/categories");
app.use("/categories", categoriesRouter);

// roles router
const rolesRouter = require("./routers/roles");
app.use("/roles", rolesRouter);

// users router
const usersRouter = require("./routers/users");
app.use("/users", authMiddleware, usersRouter);

// visitor router
const visitorRouter = require("./routers/webVisitor");
app.use("/visitors", visitorRouter);

server.listen(process.env.APP_PORT, () => {
  console.log(`App listening on port ${process.env.APP_PORT}`);
});
