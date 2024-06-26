// checks deck count and stores variable so that it can be passed to Backend via hidden input form element
function checkDeckCount() {
  console.log(decks);
}

// passes card value and sort to back end via ajax post request
function removeCard(card) {
  var value =
    card.parentElement.getAttribute("data-value") +
    " " +
    card.parentElement.getAttribute("data-sort");
  $.ajax({
    url: "/recount",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ card: value }),
    success: function (response) {
      //console.log(response.result);
      readStats(response);
    },
    error: function (error) {
      console.log(error);
    },
  });
}

// parse value received from backend and show them as probabilites in the placeholder div
function readStats(probs) {
  placeholders = document.querySelectorAll("[id=probability]");
  console.log(placeholders);
  console.log(probs.result);
  // when passing only the number of decks (for initial probability display)
  if (typeof probs === "number") {
    placeholders.forEach((element) => {
      element.innerHTML = ((probs / (probs * 52)) * 100).toFixed(2) + "%";
    });
    // parsing Object that is received from AJAX query
  } else if (Array.isArray(probs.result)) {
    // it is an object with 'result' key
    probs.result.forEach((prob) => {
      for (let placeholder of placeholders) {
        sort = placeholder.parentElement.getAttribute("data-sort");
        value = placeholder.parentElement
          .getAttribute("data-value")
          .toLowerCase();
        if (sort === prob[0][0] && value === prob[0][1].toLowerCase()) {
          placeholder.innerHTML = (prob[1] * 100).toFixed(2) + "%";
        }
      }
    });
  }
}

// count cards within placeholder divs
function countCards(container) {
  let counter;

  // count all cards initially via passing placeholder collection (containerArray) to this function here - this should only occur at the start of a session once
  if (Array.isArray(container)) {
    container.forEach((placeholder) => {
      counter = 0;
      //console.log(placeholder);
      for (let element of placeholder.children) {
        if (element.getAttribute("class") === "card") {
          counter++;
        }
      }

      placeholder.querySelector("#count").innerHTML = counter;
    });
    // getting passed a
  } else {
    if (container.querySelector(".card") === null) {
      container.querySelector("#count").setAttribute("class", "count-zero");
      container.querySelector("[id=probability]").innerHTML = 0 + "%";
    }
    //console.log(arr.querySelectorAll(".card"));
    counter = container.querySelectorAll(".card").length;
    container.querySelector("#count").innerHTML = counter;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  checkDeckCount();
  // assigns decks variable from jinja var decks -> to in html declared decks var to hidden element value attribute
  document.getElementById("deckCount").value = decks;

  readStats(parseInt(decks));

  const cardContainer = document.getElementsByClassName("card-placeholder");
  const cards = document.getElementsByClassName("card");

  const cardArray = Array.from(cards);
  const containerArray = Array.from(cardContainer);

  // stack cards of same value and sort in each placeholder container respectively
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
        if (
          c === placeholder.firstElementChild ||
          c.getAttribute("class") != "card"
        ) {
          continue;
        } else {
          c.setAttribute("style", marginTopParam);
          //console.log(c);
          marginValue += 5;
        }
      }
    }
  });

  // Count all cards initially
  countCards(containerArray);

  cardArray.forEach((card) => {
    // Add click event listener to dispose of cards
    card.addEventListener("click", function () {
      // pass parent placeholder container to updated card count
      removedCard = card.parentElement;
      //card.classList.add("hide"); // Hide the disposed card - legacy not needed bc remove s. below
      // send card to backend
      removeCard(card);
      // remove from DOM
      card.remove();
      // update count of placeholder container
      countCards(removedCard);
    });
  });
});
