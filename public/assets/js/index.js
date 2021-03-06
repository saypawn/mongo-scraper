/* global bootbox */
$(document).ready(function () {
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);
    $(".clear").on("click", handleArticleClear);

    function initPage() {
        // Run an AJAX request for any unsaved headlines
        $.get("/api/headlines?saved=false").then(function (data) {
            articleContainer.empty();
            // If we have headlines, render them to the page
            if (data && data.length) {
                renderArticles(data);
            } else {
                // Otherwise render a message explaining we have no articles
                renderEmpty();
            }
        });
    }
    // This function handles appending HTML containing our article data to the page
    function renderArticles(articles) {
        var articleCards = [];
        for (var i = 0; i < articles.length; i++) {
            articleCards.push(createCard(articles[i]));
        }
        articleContainer.append(articleCards);
    }

    // This function takes in a single JSON object for an article/headline
    function createCard(article) {
        var card = $("<div class='card'>");
        var cardHeader = $("<div class='card-header'>").append(
            $("<h3>").append(
                $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
                    .attr("href", article.url)
                    .text(article.headline),
                $("<a class='btn btn-success save'>Save Article</a>")
            )
        );

        var cardBody = $("<div class='card-body'>").text(article.summary);

        card.append(cardHeader, cardBody);
        // We attach the article's id to the jQuery element
        // We will use this when trying to figure out which article the user wants to save
        card.data("_id", article._id);
        // We return the constructed card jQuery element
        return card;
     }

        function renderEmpty() {
            // This function renders some HTML to the page explaining we don't have any articles to view
            // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
            var emptyAlert = $(
                [
                    "<div class='alert alert-warning text-center'>",
                    "<h4>Sorry we don't have any new articles.</h4>",
                    "</div>",
                    "<div class='card'>",
                    "<div class='card-header text-center'>",
                    "<h3>What Would You Like To Do?</h3>",
                    "</div>",
                    "<div class='card-body text-center'>",
                    "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
                    "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
                    "</div>",
                    "</div>"
                ].join("")
            );
            // Appending this data to the page
            articleContainer.append(emptyAlert);
         }   

        // This function is when the user wants to save an article
        function handleArticleSave() {
            var articleToSave = $(this)
                .parents(".card")
                .data();

            // Remove card from page
            $(this)
                .parents(".card")
                .remove();

            articleToSave.saved = true;
            // Using a patch method to be semantic since this is an update to an existing record in our collection
            $.ajax({
                method: "PUT",
                url: "/api/headlines/" + articleToSave._id,
                data: articleToSave
            }).then(function (data) {
                // If the data was saved successfully
                if (data.saved) {
                    // Run the initPage function again. This will reload the entire list of articles
                    initPage();
                }
            });
        }

        function handleArticleScrape() {
            // This function handles the user clicking any "scrape new article" buttons
            $.get("/api/fetch").then(function (data) {

                initPage();
                bootbox.alert($("<h3 class='text-center m-top-80'>").text(data.message));
            });
        }

        function handleArticleClear() {
            $.get("api/clear").then(function () {
                articleContainer.empty();
                initPage();
            });
        }
    
    });
