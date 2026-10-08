// ======================================
// LOAD RSS FEED
// ======================================

async function loadFeed(url) {

    const container =
        document.getElementById("feedContainer");

    const loading =
        document.getElementById("loading");

    const error =
        document.getElementById("error");

    const feedTitle =
        document.getElementById("feedTitle");


    // Clear previous content
    container.innerHTML = "";

    feedTitle.innerText = "";

    error.innerText = "";

    loading.style.display = "block";


    try {

        const response = await fetch(
            `/feed?url=${encodeURIComponent(url)}`
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Unable to load RSS feed"
            );
        }


        // Display feed title
        feedTitle.innerText =
            data.feedTitle;


        // Check articles
        if (
            !data.articles ||
            data.articles.length === 0
        ) {

            container.innerHTML =
                "<p>No articles found.</p>";

            return;
        }


        // Display articles
        data.articles.forEach(article => {

            const card =
                document.createElement("div");

            card.className = "card";


            const title =
                document.createElement("h3");

            title.innerText =
                article.title;


            const date =
                document.createElement("p");

            date.className = "date";

            date.innerText =
                formatDate(article.pubDate);


            const description =
                document.createElement("p");

            description.innerText =
                cleanDescription(
                    article.description
                );


            const link =
                document.createElement("a");

            link.href =
                article.link;

            link.target =
                "_blank";

            link.rel =
                "noopener noreferrer";

            link.innerText =
                "Read More →";


            card.appendChild(title);

            card.appendChild(date);

            card.appendChild(description);

            card.appendChild(link);

            container.appendChild(card);

        });

    } catch (err) {

        console.error(err);

        error.innerText =
            "Unable to load RSS feed. Please check the URL.";

    } finally {

        loading.style.display = "none";
    }
}


// ======================================
// LOAD CUSTOM FEED
// ======================================

function loadCustomFeed() {

    const input =
        document.getElementById("rssUrl");

    const url =
        input.value.trim();


    if (!url) {

        document.getElementById("error").innerText =
            "Please enter an RSS feed URL.";

        return;
    }


    loadFeed(url);
}


// ======================================
// FORMAT DATE
// ======================================

function formatDate(dateString) {

    if (!dateString) {

        return "Date not available";
    }


    const date =
        new Date(dateString);


    if (isNaN(date.getTime())) {

        return dateString;
    }


    return date.toLocaleString();
}


// ======================================
// CLEAN DESCRIPTION
// ======================================

function cleanDescription(description) {

    if (!description) {

        return "No description available.";
    }


    // Remove HTML tags
    const temp =
        document.createElement("div");

    temp.innerHTML =
        description;


    return temp.textContent ||
        temp.innerText ||
        "No description available.";
}