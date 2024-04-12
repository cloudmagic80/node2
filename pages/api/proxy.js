// pages/api/proxy.js (Simplified without the catch-all route for clarity)

import cheerio from "cheerio";

export default async function handler(req, res) {
  const page = req.query.proxy; // Directly use the query parameter
  console.log("Requested page:", page);

  if (!page) {
    res.status(404).send("Not found");
    return;
  }

  let targetUrl;
  // Determine the target URL based on the query parameter
  switch (page) {
    case "page1":
      targetUrl = "http://www.faqs.org/rfcs/";
      break;
    case "page2":
      targetUrl = "http://example.com/page2";
      break;
    default:
      res.status(404).send("Not found");
      return;
  }

  try {
    const response = await fetch(targetUrl);
    let text = await response.text();

    // Load the HTML content into cheerio
    const $ = cheerio.load(text);

    // Manipulate HTML based on the target page
    if (page === "page1") {
      $("h1").text("New Title for Page 1");
    } else if (page === "page2") {
      $("h1").text("New Title for Page 2");
    }

    // Serialize the modified HTML and send the response
    text = $.html();
    res.setHeader("Content-Type", "text/html");
    res.status(response.status).send(text);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).end("Proxy error");
  }
}
