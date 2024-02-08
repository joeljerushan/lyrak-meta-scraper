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
    /* const response = await axios.get(url);

    if (response.status !== 200) {
      return { error: `HTTP error: ${response.status}` };
    }

    const html = response.data;

    // Fetch Open Graph meta tags
    const ogTags = await new Promise((resolve, reject) => {
      ogs({ url }, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.data);
        }
      });
    }); */

    // Fetch Twitter card meta tags
    /* const twitterTags = await new Promise((resolve, reject) => {
      twitterCard({ url }, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    }); */

    const metadata = await urlMetadata("https://x.com/benthompson?s=21", {
      // custom request headers
      requestHeaders: {
        "User-Agent": "url-metadata/3.0 (npm module)",
        From: "example@example.com",
      },

      // `fetch` API cache setting for request
      cache: "no-cache",

      // `fetch` API mode (ex: 'cors', 'no-cors', 'same-origin', etc)
      mode: "cors",

      // charset to decode response with (ex: 'auto', 'utf-8', 'EUC-JP')
      // defaults to auto-detect in `Content-Type` header or meta tag
      // the default `auto` option decodes with `utf-8`
      // override by passing in charset here (ex: 'windows-1251'):
      decode: "auto",

      // timeout in milliseconds, default is 10 seconds
      timeout: 10000,

      // number of characters to truncate description to
      descriptionLength: 750,

      // force image urls in selected tags to use https,
      // valid for images & favicons with full paths
      ensureSecureImageRequest: true,

      // return raw response body as string
      includeResponseBody: false,
    });
    console.log("fetched metadata:", metadata);

    return {
      test: "metadata",
      // title: ogTags.ogTitle,
      // metaDescription: ogTags.ogDescription,
      // imageUrl: ogTags.ogImage.url,
      // twitterTitle: twitterTags.twitterTitle,
      // twitterDescription: twitterTags.twitterDescription,
      // twitterImageUrl: twitterTags.twitterImage.url,
      // Add more fields as needed
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
