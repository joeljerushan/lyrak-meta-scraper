const express = require("express");
const axios = require("axios");
const ogs = require("open-graph-scraper");
const twitterCard = require("twitter-card");

const urlMetadata = require("url-metadata");

const app = express();
const port = 3000;

app.set("json spaces", 2);

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
  res.header("Access-Control-Allow-Origin", "*");
  const url = req.query.url;

  if (!req.query.url)
    return res.json({
      error: "An error has occured, you may have inputted an incorrect url.",
      usage: `https://${req.hostname}/?url=https://google.com`,
    });
  fetch(req.query.url)
    .then((result) => result.text())
    .then((page) => {
      const $ = cheerio.load(page);
      var title =
        $('meta[property="og:title"]').attr("content") ||
        $("title").text() ||
        $('meta[name="title"]').attr("content");
      var description =
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content");
      var url = $('meta[property="og:url"]').attr("content");
      var site_name = $('meta[property="og:site_name"]').attr("content");
      var image =
        $('meta[property="og:image"]').attr("content") ||
        $('meta[property="og:image:url"]').attr("content");
      var icon =
        $('link[rel="icon"]').attr("href") ||
        $('link[rel="shortcut icon"]').attr("href");
      var keywords =
        $('meta[property="og:keywords"]').attr("content") ||
        $('meta[name="keywords"]').attr("content");
      res.json({ title, description, url, site_name, image, icon, keywords });
    })
    .catch((err) => {
      return res.json({
        error: "An error has occured, you may have inputted an incorrect url.",
        usage: `https://${req.hostname}/?url=https://google.com`,
      });
    });

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
