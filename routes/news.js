// routes/news.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const { q, from, to } = req.query;

    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q,
        from,
        to,
        pageSize: 100,
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching news" });
  }
});

module.exports = router;
