const express = require("express");
const auth = require("../middlewares/auth");

const {
  getArticles,
  createArticle,
  deleteArticle,
} = require("../controllers/article");

const router = express.Router();

router.use(auth);

router.get("/", getArticles);
router.post("/", createArticle);
router.delete("/:articleId", deleteArticle);

module.exports = router;
