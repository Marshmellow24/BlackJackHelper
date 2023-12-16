

function checkDeckCount () {
  console.log(decks);
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
    });
  });

});