const express = require("express");
const Parser = require("rss-parser");

const app = express();

const PORT = process.env.PORT || 3000;

const parser = new Parser();

// Serve frontend files
app.use(express.static("public"));


// ==============================
// RSS FEED ROUTE
// ==============================

app.get("/feed", async (req, res) => {

    try {

        const url = req.query.url;

        // Check URL
        if (!url) {

            return res.status(400).json({
                error: "RSS feed URL is required"
            });
        }

        // Parse RSS feed
        const feed = await parser.parseURL(url);

        // Return only required information
        const articles = feed.items.map(item => ({
            title: item.title || "No title",
            link: item.link || "#",
            pubDate: item.pubDate || "Date not available",
            description:
                item.contentSnippet ||
                item.content ||
                "No description available"
        }));

        res.json({
            feedTitle: feed.title || "RSS Feed",
            articles: articles
        });

    } catch (error) {

        console.error("RSS Error:", error.message);

        res.status(500).json({
            error: "Unable to fetch RSS feed"
        });
    }
});


// ==============================
// START SERVER
// ==============================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});