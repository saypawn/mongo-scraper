//code for saving notes
$(document).ready(function() {
    var articleContainer = $(".article-container");
    // Adding event listeners for buttons for deleting articles,
    // pulling up article notes, saving article notes, and deleting article notes
    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);
    $(".clear").on("click", handleArticleClear);
  
    function initPage() {
      // Empty the article container, run an AJAX request for any saved headlines
      $.get("/api/headlines?saved=true").then(function(data) {
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
        // card with our article data inside
        for (var i = 0; i < articles.length; i++) {
          articleCards.push(createCard(articles[i]));
        }
        // append them to the articleCards container
        articleContainer.append(articleCards);
      }

      function createCard(article) {
        // This function takes in a single JSON object for an article/headline
        // article card
        var card = $("<div class='card'>");
        var cardHeader = $("<div class='card-header'>").append(
          $("<h3>").append(
            $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
              .attr("href", article.url)
              .text(article.headline),
            $("<a class='btn btn-danger delete'>Delete From Saved</a>"),
            $("<a class='btn btn-info notes'>Article Notes</a>")
          )
        );
    
        var cardBody = $("<div class='card-body'>").text(article.summary);
        card.append(cardHeader, cardBody);
        card.data("_id", article._id);
        return card;
      }
    
      function renderEmpty() {
        // This function renders some HTML to the page explaining we don't have any articles to view
        // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
        var emptyAlert = $(
          [
            "<div class='alert alert-warning text-center'>",
            "<h4>Uh Oh. Looks like we don't have any saved articles.</h4>",
            "</div>",
            "<div class='card'>",
            "<div class='card-header text-center'>",
            "<h3>Would You Like to Browse Available Articles?</h3>",
            "</div>",
            "<div class='card-body text-center'>",
            "<h4><a href='/'>Browse Articles</a></h4>",
            "</div>",
            "</div>"
          ].join("")
        );
        // Appending this data to the page
        articleContainer.append(emptyAlert);
      }

      function renderNotesList(data) {
        // This function handles rendering note list items to our notes modal
        // Setting up an array of notes to render after finished
        // Also setting up a currentNote variable to temporarily store each note
        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
          // If we have no notes, just display a message explaining this
          currentNote = $("<li class='list-group-item'>No notes for this article yet.</li>");
          notesToRender.push(currentNote);
        } else {
          // If we do have notes, go through each one
          for (var i = 0; i < data.notes.length; i++) {
            // Constructs an li element to contain our noteText and a delete button
            currentNote = $("<li class='list-group-item note'>")
              .text(data.notes[i].noteText)
              .append($("<button class='btn btn-danger note-delete'>x</button>"));
            // Store the note id on the delete button for easy access when trying to delete
            currentNote.children("button").data("_id", data.notes[i]._id);
            // Adding our currentNote to the notesToRender array
            notesToRender.push(currentNote);
          }
        }
        // Now append the notesToRender to the note-container inside the note modal
        $(".note-container").append(notesToRender);
      }