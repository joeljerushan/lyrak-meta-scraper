const express = require("express");
const app = express();
app.set("json spaces", 2);
const cheerio = require("cheerio");

app.use((req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  if (!req.query.url)
    return res.json({
      success: false,
      error: "An error has occured, you may have inputted an incorrect url.",
      // usage: `https://${req.hostname}/?url=https://google.com`,
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

      const twitter_title = $('meta[name="twitter:title"]').attr("content");
      const twitter_description = $('meta[name="twitter:description"]').attr(
        "content"
      );
      const twitter_image = $('meta[name="twitter:image"]').attr("content");
      const twitter_site = $('meta[name="twitter:site"]').attr("content");
      const twitter_creator = $('meta[name="twitter:creator"]').attr("content");

      const urlObject = new URL(url);
      const domain = urlObject.hostname;

      res.json({
        title,
        description,
        url,
        site_name,
        image,
        icon,
        keywords,
        twitter_title,
        twitter_description,
        twitter_image,
        twitter_site,
        twitter_creator,
        domain,
      });
    })
    .catch((err) => {
      return res.json({
        success: false,
        error: "An error has occured, you may have inputted an incorrect url.",
        // usage: `https://${req.hostname}/?url=https://google.com`,
      });
    });
});

const listener = app.listen(3000, () => {
  console.log("Server started!");
});
