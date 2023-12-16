

function checkDeckCount () {
  console.log(decks);
}


function removeCard (card) {
  var value = card.parentElement.getAttribute("data-value") + " " + card.parentElement.getAttribute("data-sort"); 
  $.ajax({ 
      url: '/recount', 
      type: 'POST', 
      contentType: 'application/json', 
      data: JSON.stringify({ 'card': value }), 
      success: function(response) { 
        console.log(response.result); 
      }, 
      error: function(error) { 
          console.log(error); 
      } 
  }); 
}


document.addEventListener("DOMContentLoaded", function () {
  
  checkDeckCount();
  document.getElementById("deckCount").value = decks;
  console.log(document.getElementById("deckCount").value);


  const cardContainer =
    document.getElementsByClassName("card-placeholder");
  const cards = document.getElementsByClassName("card");

  const cardArray = Array.from(cards);
  const containerArray = Array.from(cardContainer);

  containerArray.forEach((placeholder) => {
    if (placeholder.hasChildNodes) {
      let marginValue = 5;
      for (let c of placeholder.children) {
        sort = placeholder.getAttribute("data-sort");
        value = placeholder.getAttribute("data-value").toLowerCase();
        marginTopParam =
          "background-image: url('static/img/cards/" +
          value +
          "_" +
          sort +
          ".png'); margin-top: " +
          marginValue +
          "%; margin-left: " +
          marginValue +
          "%";
        if (c === placeholder.firstElementChild) {
          continue;
        } else {
          c.setAttribute("style", marginTopParam);
          //console.log(c);
          marginValue += 5;
        }
      }
    }
  });


  cardArray.forEach((card) => {
    // Add click event listener to dispose of cards
    card.addEventListener("click", function () {
      card.classList.add("hide"); // Hide the disposed card
      removeCard(card);
    });
  });

});