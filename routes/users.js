const auth = require("../middlewares/auth");

const express = require("express");
const { getCurrentUser } = require("../controllers/user");

const router = express.Router();

router.use(auth);

router.get("/me", getCurrentUser);

module.exports = router;
