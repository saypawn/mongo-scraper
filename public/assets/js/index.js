/* global bootbox */
$(document).ready(function() {
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);
    $(".clear").on("click", handleArticleClear);
  
    function initPage() {
      // Run an AJAX request for any unsaved headlines
      $.get("/api/headlines?saved=false").then(function(data) {
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
