/** BLOCK 2: PIECEWISE ANNOTATION */

//Next Button
var next = document.getElementById("next");
function checkDone() {
  var done = true;
  Object.values(annotated).forEach((val) => {
    if (val === "") {
      done = false;
    }
  });
  if (done) {
    // document.getElementById("next-area").style.display = "block";
    next.disabled = false;
  }
}

/** UPLOAD DATA*/
next.addEventListener("click", async (e) => {
  next.disabled = true;

  if (tangramFile || hitId === null) {
    // **local tests
    reset();

    const { value: text } = await Swal.fire({
      title: "<strong>Annotations submitted!</strong>",
      icon: "success",
      html: 'Thank you for completing the task!<textarea id="swal-input1" class="swal2-input" rows="4" style="font-family: Times, serif; padding-top: 1px;" placeholder="(Optional) Enter your feedback...">',
      confirmButtonText: "Submit",
      confirmButtonColor: "#4caf50",
      preConfirm: () => {
        return document.getElementById("swal-input1").value;
      },
      showCancelButton: false,
      showCloseButton: false,
      focusConfirm: true,
      showConfirmButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: true,
    });
    console.log(text);
  } else if (assignmentId === "ASSIGNMENT_ID_NOT_AVAILABLE") {
    // for preview
    reset();
    Swal.fire({
      title: "<strong>This is a preview</strong>",
      icon: "info",
      html: "This is only a preview of the task. Please accept and complete the HIT to receive payment!",
      showCloseButton: false,
      focusConfirm: false,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  } else {
    // Working from mturk
    var fileName = file.replace(".svg", "");

    //annotation
    var uploadData = {};
    uploadData["whole-annotation"] = {
      wholeAnnotation: wholeAnnotation,
      timestamp: wholeTimestamp,
    };
    uploadData["piece-annotation"] = annotated;
    uploadData["metadata"] = metadata;
    uploadData["submittedAt"] = firebase.firestore.Timestamp.now();
    uploadData["assignmentId"] = assignmentId;
    uploadData["hitId"] = hitId;
    uploadData["version"] = version;
    uploadData["workerId"] = workerId;
    uploadData["fileName"] = fileName;
    console.log(uploadData);

    var updateField = {};
    updateField[workerId] = uploadData;

    //user
    var userField = {};
    userField[fileName] = uploadData;
    userField["assignmentId"] =
      firebase.firestore.FieldValue.arrayUnion(assignmentId);
    userField["hitId"] = firebase.firestore.FieldValue.arrayUnion(hitId);
    userField["workerId"] = workerId;

    //1. add to annotations
    //2. increment count in files
    //3. add to user's annotations
    //4. update assignment status

    var feedbackText = "";
    //firebase
    db.collection("annotations")
      .doc(fileName)
      .set(updateField, { merge: true })
      .then(() => {
        db.collection("users")
          .doc(workerId)
          .set(userField, { merge: true })
          .catch((error) => {
            console.error("Error adding document: ", error);
          })
          .then(() => {
            db.collection("files")
              .doc(file)
              .update({
                count: firebase.firestore.FieldValue.increment(1),
                available: true,
                completedWorkers:
                  firebase.firestore.FieldValue.arrayUnion(workerId),
              })
              .then(() => {
                db.collection("assignments")
                  .doc(assignmentId)
                  .set(
                    {
                      unfinished: false,
                      submittedAt: firebase.firestore.Timestamp.now(),
                      sandbox:
                        turkSubmitTo === null
                          ? null
                          : turkSubmitTo.includes("sandbox"),
                      version: version,
                    },
                    { merge: true }
                  )
                  .then(() => {
                    db.collection("counts")
                      .doc("counts")
                      .update({
                        [fileName]: firebase.firestore.FieldValue.increment(1),
                      })
                      .then(async () => {
                        reset();

                        const { value: text } = await Swal.fire({
                          title: "<strong>Annotations submitted!</strong>",
                          icon: "success",
                          html: 'Thank you for completing the task!<textarea id="swal-input1" class="swal2-input" rows="4" style="font-family: Times, serif; padding-top: 1px;" placeholder="(Optional) Enter your feedback...">',
                          confirmButtonText: "Submit",
                          confirmButtonColor: "#4caf50",
                          preConfirm: () => {
                            return document.getElementById("swal-input1").value;
                          },
                          showCancelButton: false,
                          showCloseButton: false,
                          focusConfirm: true,
                          showConfirmButton: true,
                          allowOutsideClick: false,
                          allowEscapeKey: false,
                          allowEnterKey: true,
                        });

                        feedbackText = text;

                        db.collection("assignments")
                          .doc(assignmentId)
                          .update({
                            feedback: text,
                          })
                          .then(() => {
                            //MTurk submit
                            const urlParams = new URLSearchParams(
                              window.location.search
                            );

                            // create the form element and point it to the correct endpoint
                            const form = document.createElement("form");
                            form.action = new URL(
                              "mturk/externalSubmit",
                              urlParams.get("turkSubmitTo")
                            ).href;
                            form.method = "post";

                            // attach the assignmentId
                            const inputAssignmentId =
                              document.createElement("input");
                            inputAssignmentId.name = "assignmentId";
                            inputAssignmentId.value =
                              urlParams.get("assignmentId");
                            inputAssignmentId.hidden = true;
                            form.appendChild(inputAssignmentId);

                            // need one additional field asside from assignmentId
                            const inputFeedback =
                              document.createElement("input");
                            inputFeedback.name = "feedback";
                            inputFeedback.value = feedbackText;
                            inputFeedback.hidden = true;
                            form.appendChild(inputFeedback);

                            // copy of database data
                            const inputData = document.createElement("input");
                            inputData.name = "data";
                            inputData.value = JSON.stringify(uploadData);
                            inputData.hidden = true;
                            form.appendChild(inputData);

                            // attach the form to the HTML document and trigger submission
                            document.body.appendChild(form);
                            form.submit();
                          });
                      });
                  });
              })
              .catch((error) => {
                console.error("Error adding document: ", error);
              });
          });
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }
});

// Submit button
var bt = document.getElementById("submit");

// submit on enter key
document.querySelector("#annotate").addEventListener("keyup", (event) => {
  if (event.key !== "Enter") return; // Use `.key` instead.
  document.querySelector("#submit").click(); // Things you want to do.
  event.preventDefault(); // No need to `return false;`.
});

// next on shift key
document.addEventListener("keyup", (event) => {
  if (event.key !== "Shift") return; // Use `.key` instead.
  document.querySelector("#next").click(); // Things you want to do.
  event.preventDefault(); // No need to `return false;`.
});

/** MAIN ANNOTATION */
function annotate(ann) {
  // preprocess annotation: lowercase, no special char except space, no leading/trailing space
  if (ann !== "UNKNOWN") {
    ann = ann.toLowerCase().trim();
    ann = ann.replace(/[^a-zA-Z0-9,./:'()&~\- ]/g, "");
  }
  // Submit button
  var bt = document.getElementById("submit");
  // idk button
  var idk = document.getElementById("idk");

  if (!selection.every((v) => v === false)) {
    // bad annotations reminder
    reminders(selection, ann);

    //selected pieces
    var indices = selection.reduce(
      (out, bool, index) => (bool ? out.concat(index + 1) : out),
      []
    );

    // annotation color
    var color = colors[indices[0]];
    const old_ann_idx = ann_to_idx[ann];

    // check for duplicate
    // is dup & add to group
    // 1. color the piece to group color
    // 2. set old metadata "final" field to false
    // 3. add new metadata
    if (old_ann_idx) {
      // get group color, override new color
      color = piece_to_color[old_ann_idx[0]];
      // set final of last operation to false
      var last_operation = piece_to_last_id[old_ann_idx[0]];
      metadata[last_operation]["final"] = false;
      // prepare coloring
      indices = indices.concat(old_ann_idx); // indices is now old+new
      delete ann_to_idx[ann]; // delete old entry
    }

    // color the pieces, add annotation
    for (var i = 0; i < indices.length; i++) {
      // index in selected pieces indices array (piece id)
      const id = indices[i];
      var t = svgDoc.getElementById(id.toString());
      t.setAttribute("fill", color);
      // t.setAttribute("stroke", "white");
      // deselect
      selection[id - 1] = false;
      // add annotation and reverse mapping
      annotated[id] = ann;
      if (ann_to_idx[ann]) {
        ann_to_idx[ann].push(id);
      } else {
        ann_to_idx[ann] = [id];
      }
      // add to piece_to_color
      piece_to_color[id] = color;
      // record last operation
      piece_to_last_id[id] = lastid;
    }

    allSameReminder();

    // save metadata
    metadata[lastid] = {
      annotation: ann,
      pieces: ann_to_idx[ann],
      timestamp: firebase.firestore.Timestamp.now(),
      final: true,
    };

    // present NEW annotation
    if (!old_ann_idx) {
      var list = document.getElementById("list");
      var entry = document.createElement("li");
      // var colorText =
      //   color === "deeppink" ? "pink" : color === "gold" ? "yellow" : color;
      // entry.appendChild(
      //   document.createTextNode(
      //     "The " + colorText + " part is the " + ann + "."
      //   )
      // );
      entry.appendChild(document.createTextNode(ann));
      entry.setAttribute("id", lastid);
      entry.setAttribute("style", "color:" + color);

      //remove annotation
      var removeButton = document.createElement("button");
      removeButton.setAttribute("class", "btn");
      removeButton.innerHTML = '<i class="fa fa-trash"></i>';
      // removeButton.appendChild(document.createTextNode("X"));
      removeButton.setAttribute(
        "onClick",
        'remove("' + ann + '","' + lastid + '")'
      );

      var rbStyle = `
      margin-left: 1vh;
      background-color: #de2b2b;
      border: none;
      color: white;
      font-size: 15px;
      cursor: pointer;
      vertical-align: 5%;
      `;

      removeButton.setAttribute("style", rbStyle);
      entry.appendChild(removeButton);
      list.appendChild(entry);
    }

    // clear inputs
    document.getElementById("annotate").value = "";
    bt.disabled = true;
    bt.innerHTML = 'Annotate <img class="icon"  src="icons/enter.png"/>';
    idk.disabled = true;
    bt.blur();
    idk.blur();

    // logging();

    // increment operations
    lastid += 1;
    // restore submit/textbox
    validSubmit();
    // check done all pieces
    checkDone();
  }
}

// Submit or add to group
bt.addEventListener(
  "click",
  function (event) {
    // annotation
    var ann = document.getElementById("annotate").value;
    annotate(ann);
  },
  false
);

// idk button
var idk = document.getElementById("idk");

idk.addEventListener("click", function (event) {
  // annotation
  annotate("UNKNOWN");
});
