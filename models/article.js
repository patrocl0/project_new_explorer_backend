const mongoose = require("mongoose");

const urlRegex = /^https:\/\/[a-z0-9.-]+\.[a-z]{2,}(\/[^\s"'<>]*)?$/i;

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },

  urlToImage: {
    type: String,
    required: true,
    validate: {
      validator: (v) => urlRegex.test(v),
      message: "El enlace de la noticia no valido",
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => urlRegex.test(v),
      message: "El enlace de la noticia no valido",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("article", articleSchema);
