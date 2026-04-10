require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const cors = require("cors");

const { login, createUser } = require("./controllers/user");
const usersRouter = require("./routes/users");
const articleRouter = require("./routes/articles");
const newsRouter = require("./routes/news");

const { requestLogger } = require("./middlewares/requestLogger");
const { errorLogger } = require("./middlewares/errorLogger");
const errorHandler = require("./middlewares/errorHandler");
const auth = require("./middlewares/auth");

const PORT = process.env.PORT || 3001;

const app = express();

const allowedOrigins = [
  "https://newexplorer.ignorelist.com",
  "https://api.newexplorer.ignorelist.com",
  "http://localhost:5173",
];

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error(err));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

app.use(express.json());

app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("El servidor va a caer");
  }, 0);
});
app.post("/signin", login);
app.post("/signup", createUser);
app.use("/news", newsRouter);

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
