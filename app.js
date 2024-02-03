const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const followRedirects = require('follow-redirects');

const app = express();
const port = 3000;

app.use(express.json());


async function scrapeMetadata(url) {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
  
    const title = $('title').text();
    const metaDescription = $('meta[name="description"]').attr('content');
    const imageUrl = $('meta[property="og:image"]').attr('content');
    // Extract other metadata as needed
  
    return {
      title,
      metaDescription,
      imageUrl,
      // Add more fields as needed
    };
}

  
app.get('/scrape', async (req, res) => {
  const url = req.query.url;

  try {
    const metadata = await scrapeMetadata(url);
    res.json(metadata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
