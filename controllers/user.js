const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.json(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      const error = new Error("No se ha encontrado ningun usuario con ese id");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      return res.json(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        err.statusCode = 400;
        err.message = "ID inválido";
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  console.log(email);
  console.log(password);

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Credenciales incorrectas"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          const err = new Error("Correo o contraseña incorrectos");
          err.statusCode = 401;
          throw err;
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });

        return res.send({ token });
      });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password, username } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      return User.create({ email, password: hash, username });
    })
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;

      return res.status(201).json(userObj);
    })
    .catch((err) => {
      if (err.code === 11000) {
        err.statusCode = 409;
        err.message = "El correo ya está registrado";
      }

      if (err.name === "ValidationError") {
        err.statusCode = 400;
        err.message = "Datos inválidos";
      }

      next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        err.statusCode = 400;
        err.message = "ID inválido";
      }

      next(err);
    });
};
