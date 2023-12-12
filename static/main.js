
function sortCards(a, b) {
  /*
  let valA = Number.isNaN(parseInt(a.getAttribute("data-value")))
    ? a.getAttribute("data-value")
    : parseInt(a.getAttribute("data-value"));
  let valB = Number.isNaN(parseInt(b.getAttribute("data-value")))
    ? b.getAttribute("data-value")
    : parseInt(b.getAttribute("data-value"));
  */
  let valA = a.getAttribute("data-value");
  let valB = b.getAttribute("data-value");
  let sorA = a.getAttribute("data-sort");
  let sorB = b.getAttribute("data-sort");

  if (valA > valB) {
    return -1;
  } else if (valA < valB) {
    return 1;
  } else if (valA === valB) {
    if (sorA > sorB) {
      return 1;
    } else {
      return -1;
    }
  }
}

{{ v + "\n" + s + " "}} <br />
{{(deck+1)|string }}