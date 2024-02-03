const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const followRedirects = require("follow-redirects");

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
    const $ = cheerio.load(html);

    const title = $("title").text();
    const metaDescription = $('meta[name="description"]').attr("content");
    const imageUrl = $('meta[property="og:image"]').attr("content");
    // Extract other metadata as needed

    return {
      title,
      metaDescription,
      imageUrl,
      // Add more fields as needed
    };
  } catch (error) {
    console.log("catch error ", error.response);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      const statusText = error.response.statusText;

      if (status === 403) {
        return { error: `Forbidden: ${statusText}`, status };
      } else {
        return { error: `HTTP error: ${status}`, status };
      }
    } else if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      return { error: "URL not found or unreachable.", status: 404 };
    }

    // For other errors, you might want to return a different status code
    return { error: "Internal Server Error", status: 500 };
  }
}

app.get("/scrape", async (req, res) => {
  const url = req.query.url;

  try {
    const metadata = await scrapeMetadata(url);
    res.json(metadata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function resolveShortLink(url) {
  try {
    const response = await axios.head(url, { maxRedirects: 5 });
    return response.request.res.responseUrl;
  } catch (error) {
    console.error(error);
    throw new Error("Unable to resolve short link.");
  }
}

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
