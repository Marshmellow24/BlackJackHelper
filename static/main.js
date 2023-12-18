
// checks deck count and stores variable so that it can be passed to Backend via hidden input form element
function checkDeckCount () {
  console.log(decks);
}

// passes card value and sort to back end via ajax post request
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

function readStats (stat) {

}


function countCards (arr) {
  let counter;

  
  if (Array.isArray(arr)) {
    arr.forEach((placeholder) => {
      counter = 0;
      //console.log(placeholder);
      for (let element of placeholder.children) {
        if (element.getAttribute("class") === "card") {
          counter++;
        }
      }
  
     placeholder.querySelector("#stats").innerHTML = counter;
    });
  } else {
    console.log(arr.querySelectorAll(".card"));
    counter = arr.querySelectorAll(".card").length;
    arr.querySelector("#stats").innerHTML = counter;
  }
  

  //placeholder.lastElementChild.innerHTML = counter;
  
  
}



document.addEventListener("DOMContentLoaded", function () {
  
  checkDeckCount();
  // assigns decks variable from jinja var decks -> to in html declared decks var to hidden element value attribute
  document.getElementById("deckCount").value = decks;


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
        if (c === placeholder.firstElementChild || c.getAttribute("class") != "card") {
          continue;
        } else {
          c.setAttribute("style", marginTopParam);
          //console.log(c);
          marginValue += 5;
        }
      }
    }
  });

  countCards(containerArray);

  cardArray.forEach((card) => {
    // Add click event listener to dispose of cards
    card.addEventListener("click", function () {
      removedCard = card.parentElement;
      card.classList.add("hide"); // Hide the disposed card
      removeCard(card);
      card.remove();
      countCards(removedCard);
      
    });
  });

});