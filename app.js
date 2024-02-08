const express = require("express");
const axios = require("axios");
const ogs = require("open-graph-scraper");
const twitterCard = require("twitter-card");

const urlMetadata = require("url-metadata");

const app = express();
const port = 3000;

app.use(express.json());

async function scrapeMetadata(url) {
  try {
    return {
      test: "metadata",
    };
  } catch (error) {
    console.error("Scrape error:", error);
    return { error: "Internal Server Error", status: 500 };
  }
}

app.get("/scrape", async (req, res) => {
  const url = req.query.url;

  try {
    const metadata = await scrapeMetadata(url);
    res.json(metadata);
  } catch (error) {
    console.error("Request error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
