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

// sends GET to backend and asks for group count
function countGroups() {
  $.ajax({
    url: "/groupCount",
    type: "GET",
    contentType: "application/json",
    success: function (response) {
      //console.log(response);
      readGroups(response);
    },
    error: function (error) {
      console.log(error);
    },
  });
}

// receive removed cards from backend
function getQueue() {
  $.ajax({
    url: "/drawnQueue",
    type: "GET",
    contentType: "application/json",
    success: function (response) {
      console.log(response);
      readQueue(response);
    },
    error: function (error) {
      console.log(error);
    },
  });
}

// will display group probabilities of cards
function readGroups(groups) {
  let container = document.getElementById("groupsStat");

  let low = container.querySelector("[id=lowGroup]");
  let mid = container.querySelector("[id=midGroup]");
  let high = container.querySelector("[id=highGroup]");

  // innerhtml needs to be accessed here or cannot change value in DOM
  low.innerHTML = (groups[0] * 100).toFixed(2) + "%";
  mid.innerHTML = (groups[1] * 100).toFixed(2) + "%";
  high.innerHTML = (groups[2] * 100).toFixed(2) + "%";
}

// will receive removed Cards list from remover object out of backend and put it into top box
function readQueue(queue) {
  let container = document.getElementById("queueWrapper");

  checkQueueLimit(container);
  // if first span element then no separator else comma and space
  // let sep = container.hasChildNodes() ? ", " : "";

  let child = document.createElement("span");

  // only append last removed card from list
  child.innerHTML = queue[queue.length - 1];

  container.append(child);
}

function checkQueueLimit(queue) {
  if (queue.children.length >= 10) {
    queue.removeChild(queue.children[0]);
    // queue.firstChild.innerHTML = queue.firstChild.innerHTML.substring(2);
  }
}

// parse value received from backend and show them as probabilites in the placeholder div
function readStats(probs) {
  placeholders = document.querySelectorAll("[id=probability]");
  //console.log(placeholders);
  //console.log(probs.result);
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

function stickIt(element, wrapper, offset) {
  if (window.scrollY > offset) {
    // has to be done with concatenation since offsetHeight does not give out px-value but is demanded by style property
    wrapper.style.height = element.offsetHeight + "px";
    element.classList.add("sticky");
  } else {
    element.classList.remove("sticky");
    wrapper.style.height = "";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  //sticky top box - box offset has to be declared here or else will not stick to original position when scrolling up again
  let topBox = document.getElementById("topBox");
  let topBoxOffset = topBox.offsetTop;
  let topBoxWrapper = document.getElementById("topBoxWrapper");

  window.onscroll = function () {
    stickIt(topBox, topBoxWrapper, topBoxOffset);
  };

  checkDeckCount();

  // assigns decks variable from jinja var decks -> to in html declared decks var to hidden element value attribute
  document.getElementById("deckCount").value = decks;

  // receive all initial probabilities before removing cards
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

  // Count all cards and groups initially
  countCards(containerArray);

  countGroups();

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

      // receive count of low mid high groups
      countGroups();

      // get drawn cards list
      getQueue();
    });
  });
});
