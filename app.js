require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { login, createUser } = require("./controllers/user");
const usersRouter = require("./routes/users");
const articleRouter = require("./routes/articles");
const { requestLogger } = require("./middlewares/requestLogger");
const { errorLogger } = require("./middlewares/errorLogger");
const { errors } = require("celebrate");
const errorHandler = require("./middlewares/errorHandler");
const auth = require("./middlewares/auth");
const PORT = process.env.PORT || 3001;
const app = express();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error(err));

// const allowedOrigins = [
//   "https://patroclo.mooo.com",
//   "https://www.patroclo.mooo.com",
//   "http://localhost:5173",
// ];

app.use(cors());

// // app.use(
// //   cors({
// //     origin: (origin, callback) => {
// //       if (!origin || allowedOrigins.includes(origin)) {
// //         callback(null, true);
// //       } else {
// //         callback(new Error("Not allowed by CORS"));
// //       }
// //     },
// //     credentials: true,
// //   })
// // );

app.use(express.json());

app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("El servidor va a caer");
  }, 0);
});
app.post("/signin", login);
app.post("/signup", createUser);

app.use(auth);

app.use("/users", usersRouter);
app.use("/articles", articleRouter);

app.get("/", (req, res) => {
  res.send("Servidor express a la no manches wey");
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Escuchando en el puerto ${PORT}`);
});
