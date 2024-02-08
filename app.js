const express = require("express");
const axios = require("axios");
const ogs = require("open-graph-scraper");
const twitterCard = require("twitter-card");

const app = express();
const port = 3000;

app.use(express.json());

async function scrapeMetadata(url) {
  try {
    const response = await axios.get(url);

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
    });

    // Fetch Twitter card meta tags
    const twitterTags = await new Promise((resolve, reject) => {
      twitterCard({ url }, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    return {
      title: ogTags.ogTitle,
      metaDescription: ogTags.ogDescription,
      imageUrl: ogTags.ogImage.url,
      twitterTitle: twitterTags.twitterTitle,
      twitterDescription: twitterTags.twitterDescription,
      twitterImageUrl: twitterTags.twitterImage.url,
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
