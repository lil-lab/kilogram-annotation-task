/** BLOCK 1: WHOLE TANGRAM ANNOTATION */
function wholeTrial() {
  // hide questionnaire
  document.getElementById("question-layout").style.display = "none";
  // hide next
  document.getElementById("next-area").style.display = "none";
  //show output interface
  document.getElementById("left-cover").style.display = "none";
  document.getElementById("whole").style.display = "block";
  //auto focus on text input
  document.getElementById("annotate-whole").focus();
}

// continue on enter key
document.querySelector("#annotate-whole").addEventListener("keyup", (event) => {
  if (event.key !== "Enter") return; // Use `.key` instead.
  document.querySelector("#continue").click(); // Things you want to do.
  event.preventDefault(); // No need to `return false;`.
});

var bt = document.getElementById("continue");

bt.addEventListener("click", function (e) {
  var text = document.getElementById("annotate-whole");
  var input = text.value.toLowerCase().trim();
  input = input.replace(/[^a-zA-Z0-9,./:'()&~\- ]/g, "");
  wholeAnnotation = input;
  wholeTimestamp = firebase.firestore.Timestamp.now();

  // clear inputs
  text.value = "";
  // hide output interface
  document.getElementById("whole").style.display = "none";

  // BLOCK 2
  isPieceTrial = true;
  // layout
  document.getElementById("left").style.right = "40%";
  // deselect all for piece annotation
  t1.setAttribute("fill", "lightgray");
  t2.setAttribute("fill", "lightgray");
  t3.setAttribute("fill", "lightgray");
  t4.setAttribute("fill", "lightgray");
  t5.setAttribute("fill", "lightgray");
  t6.setAttribute("fill", "lightgray");
  t7.setAttribute("fill", "lightgray");

  // show output interface
  document.getElementById("piece").style.display = "block";
  document.getElementById("next-area").style.display = "block";
  // add whole result
  document.getElementById("whole-result").innerHTML =
    'Your annnotated parts of the shape "<b>' + wholeAnnotation + '</b>":';
});
