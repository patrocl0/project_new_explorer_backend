const Article = require("../models/article");

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send(articles))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;

  const owner = req.user._id;

  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner,
  })
    .then((article) => res.status(201).json(article))
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.statusCode = 400;
        err.message = "Datos inválidos";
      }

      next(err);
    });
};

module.exports.deleteArticle = (req, res, next) => {
  const { articleId } = req.params;

  Article.findById(articleId)
    .orFail(() => {
      const error = new Error("Articulo no encontrado");
      error.statusCode = 404;
      throw error;
    })
    .then((article) => {
      if (article.owner.toString() !== req.user._id) {
        const error = new Error(
          "No tienes permiso para eliminar este articulo",
        );
        error.statusCode = 403;
        throw error;
      }

      return Article.findByIdAndDelete(articleId);
    })
    .then(() => res.json({ message: "Articulo eliminado" }))
    .catch((err) => {
      if (err.name === "CastError") {
        err.statusCode = 400;
        err.message = "ID de articulo inválido";
      }
      next(err);
    });
};
