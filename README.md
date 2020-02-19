# Metadata extractor

The actor takes a URL of a web page on input,
loads the HTML using a raw HTTP request and then extracts metadata from the HTML.
The result is stored as a JSON file into the default Key-value store associated with 
actor run, under the `OUTPUT` key.

For example, for `https://www.apify.com`, the JSON result looks as follows:

```
{
    "url": "https://www.apify.com/",
    "title": "Web Scraping, Data Extraction and Automation · Apify",
    "meta": {
        "X-UA-Compatible": "IE=edge,chrome=1",
        "viewport": "width=device-width,minimum-scale=1,initial-scale=1",
        "copyright": "Copyright&copy; 2019 Apify Technologies s.r.o. All rights reserved.",
        "keywords": "web scraper, web crawler, scraping, data extraction, API",
        "robots": "index,follow",
        "referrer": "origin",
        "googlebot": "index,follow",
        "description": "Apify extracts data from websites, crawls lists of URLs and automates workflows on the web. Turn any website into an API in a few minutes!",
        "twitter:card": "summary_large_image",
        "twitter:creator": "@apify",
        "fb:app_id": "1636933253245869",
        "og:url": "https://apify.com/",
        "og:type": "website",
        "og:title": "Web Scraping, Data Extraction and Automation · Apify",
        "og:description": "Apify extracts data from websites, crawls lists of URLs and automates workflows on the web. Turn any website into an API in a few minutes!",
        "og:image": "https://apify.com/img/og-image.png",
        "og:image:alt": "Apify",
        "og:image:width": "1200",
        "og:image:height": "630",
        "og:locale": "en_IE",
        "og:site_name": "Apify",
        "next-head-count": "19"
    }
}
```
