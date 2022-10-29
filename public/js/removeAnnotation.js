window.remove = function (ann, id) {
  var list = document.getElementById("list");
  var item = document.getElementById(id);
  list.removeChild(item);
  //lookup id(annotation) to pieces
  const pieces = ann_to_idx[ann];
  for (var i = 0; i < pieces.length; i++) {
    //remove piece annotation
    const piece_id = pieces[i];
    annotated[piece_id] = "";
    var a = document.getElementById("tangramObj");
    var svgDoc = a.contentDocument;
    var t = svgDoc.getElementById(piece_id);
    t.setAttribute("fill", "lightgray");
    // reset tracker data
    piece_to_color[piece_id] = "";
  }
  //delete ann_to_idx entry
  delete ann_to_idx[ann];
  // set final to false in log
  metadata[id]["final"] = false;

  // disable next
  var next = document.getElementById("next");
  next.disabled = true;
  // document.getElementById("next-area").style.display = "none";

  // logging();
};
