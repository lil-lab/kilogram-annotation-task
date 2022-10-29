// piecewise annotation
window.stoppedTyping = function () {
  var text = document.getElementById("annotate");
  var bt = document.getElementById("submit");
  var ann = text.value.replace(/[^a-zA-Z0-9]/g, ""); // to ensure it has letters or numbers

  var annHTML = 'Annotate <img class="icon" src="icons/enter.png">';
  var addHTML = 'Add to Group <img class="icon" src="icons/enter.png">';
  if (ann.length === 0 || selection.every((v) => v === false)) {
    // empty input or no selection
    bt.disabled = true;
    bt.setAttribute("class", "button submit");
    if (bt.innerHTML != annHTML) {
      bt.innerHTML = annHTML;
    }
  } else {
    bt.disabled = false;
    //duplicate
    if (ann_to_idx[text.value]) {
      bt.setAttribute("class", "button add");
      if (bt.innerHTML != addHTML) {
        bt.innerHTML = addHTML;
      }
    } else {
      //new annotation
      bt.setAttribute("class", "button submit");
      if (bt.innerHTML != annHTML) {
        bt.innerHTML = annHTML;
      }
    }
  }
};

// whole annotation
window.stoppedTypingWhole = function () {
  var text = document.getElementById("annotate-whole");
  var bt = document.getElementById("continue");
  bt.disabled = text.value.length === 0;
};
