// *** check / change before each run!
var version = "dense3";
var expiringTime = 780000; // hit duration
var coolDownTime = 300000; // time from last claimed, to prevent all claiming the same tangram before count gets incremented
// *** end

var db = firebase.firestore();
var storageRef = firebase.storage().ref();
var file = "";
var assignmentId = "";
var hitId = "";
var workerId = "";
var turkSubmitTo = "";
var submitted = false;
var tangramFile = null;

var isPieceTrial = false;
var wholeAnnotation = "";
var wholeTimestamp = null;
var selection = [false, false, false, false, false, false, false];
var annotated = { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "" };
var ann_to_idx = {}; // maps annotation to list of piece ids
var metadata = {}; // maps list item id to metadata
var lastid = 0;
var piece_to_color = { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "" }; // current color of piece
var piece_to_last_id = { 1: -1, 2: -1, 3: -1, 4: -1, 5: -1, 6: -1, 7: -1 }; // last operation id on piece
var last_id_to_piece = {}; // operation id to piece ids

const colors = {
  1: "red",
  2: "green",
  3: "blue",
  4: "gold",
  5: "purple",
  6: "deeppink",
  7: "orange",
};

var svgDoc = null;
var t1 = null;
var t2 = null;
var t3 = null;
var t4 = null;
var t5 = null;
var t6 = null;
var t7 = null;

/** MAIN TRIAL */
window.onload = function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  tangramFile = urlParams.get("tangram");
  hitId = urlParams.get("hitId");
  workerId = md5(urlParams.get("workerId"));
  turkSubmitTo = urlParams.get("turkSubmitTo");
  assignmentId = urlParams.get("assignmentId");

  if (assignmentId === "ASSIGNMENT_ID_NOT_AVAILABLE") {
    // MTurk preview
    document.getElementById("preview").style.display = "block";
    console.log("Tangram: ", "a.svg");
    //start trial
    startTrial("a.svg");
  } else if (assignmentId && workerId && hitId) {
    // actual workers
    // check if the worker has unfinished work

    // make unique assignment ID
    assignmentId = hitId + "-" + assignmentId + "-" + workerId;

    const assignmentRef = db.collection("assignments").doc(assignmentId);
    assignmentRef.get().then((docSnapshot) => {
      if (docSnapshot.exists) {
        // has claimed unfinished tangram
        assignmentRef.get().then((doc) => {
          var data = doc.data();
          var unfinished = data["unfinished"];
          var unfinishedFile = data["file"];
          var lastClaimed = data["lastClaimed"];
          if (
            !unfinished ||
            Date.now() - lastClaimed.toMillis() >= expiringTime
          ) {
            //doesn't have unfinished or unfinished tangram already expired
            fetchTangram();
          } else {
            // continue working on unfinished tangram
            console.log("Tangram: ", unfinishedFile);
            //start trial
            startTrial(unfinishedFile);
          }
        });
      } else {
        // new assignment
        fetchTangram();
      }
    });
  } else if (tangramFile) {
    // has tangram in url
    // fetch requested tangram
    db.collection("files")
      .doc(tangramFile)
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Tangram: ", doc.id);
          //start trial
          startTrial(doc.id);
        } else {
          console.log("Tangram file doesn't exist!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  } else {
    // ** for testing
    // demo tangram
    startTrial("a.svg");
  }
};

/** Fetch a new tangram. */
function fetchTangram() {
  // update availability of expired claimed tangram sessions to true
  const filesRef = db.collection("files");
  const userDoc = db.collection("users").doc(workerId);
  filesRef
    .where("available", "==", false)
    .where(
      "lastClaimed",
      "<=",
      firebase.firestore.Timestamp.fromMillis(Date.now() - coolDownTime)
    ) // claimed 5 mins ago
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        filesRef.doc(doc.id).set({ available: true }, { merge: true });
      });
    })
    .catch((error) => {
      console.log("Error getting expired tangrams: ", error);
    })
    .then(() => {
      //claim the least annotated and available tangram
      userDoc
        .get()
        .then((doc) => {
          if (doc.exists) {
            // EXISTING USER
            var d = 0;
            var data = doc.data();
            if ("assignmentId" in data) {
              d = data["assignmentId"].length;
            }

            if (d >= 200) {
              alert(
                `You have reached the upper limit of 200 tangrams. Please return the assignment and we'll deactivate your qualification soon only because you have reached the upper limit. Thank you for completing the tasks!`
              );
              return;
            }
            if (d >= 195) {
              alert(
                `You have done over 195 annotations and you are about to reach the upper limit of 200 tangrams. We'll deactivate your qualification after you have done 200 only because that's the upper limit of tangrams we'd like you to annotate. Click "OK" to continue the task.`
              );
            }

            filesRef
              // .where("sampled", "==", true)
              .orderBy("count")
              .where("count", "<", 10)
              .where("available", "==", true)
              .limit(d + 1)
              .get()
              .then((querySnapshot) => {
                // worker hasn't done/claimed this tangram
                const doc = querySnapshot.docs.find(
                  (d) =>
                    !d.data()["completedWorkers"].includes(workerId) &&
                    !d.data()["claimedWorkers"].includes(workerId)
                );

                if (querySnapshot.docs === [] || doc === undefined) {
                  // no available
                  // or worker has done all available ones
                  alert(
                    "All available tangrams have been claimed, or you have already completed all 50 of the sampled tangrams."
                  );
                } else {
                  // claim new tangram
                  file = doc.id;

                  filesRef
                    .doc(file)
                    .set(
                      {
                        available: false,
                        lastClaimed: firebase.firestore.Timestamp.now(),
                        claimedWorkers:
                          firebase.firestore.FieldValue.arrayUnion(workerId),
                      },
                      { merge: true }
                    )
                    .then(() => {
                      //add to unfinished assignments
                      db.collection("assignments")
                        .doc(assignmentId)
                        .set(
                          {
                            unfinished: true,
                            file: file,
                            lastClaimed: firebase.firestore.Timestamp.now(),
                            workerId: workerId,
                            version: version,
                          },
                          { merge: true }
                        )
                        .then(() => {
                          // add to claimed
                          userDoc
                            .update({
                              claimed:
                                firebase.firestore.FieldValue.arrayUnion(file),
                            })
                            .then(() => {
                              console.log("Tangram: ", file);
                              //start trial
                              startTrial(file);
                            });
                        });
                    });
                }
              });
          } else {
            // FIRST TIME USER -- user doesn't exist
            filesRef
              // .where("sampled", "==", true)
              .orderBy("count")
              .where("count", "<", 10)
              .where("available", "==", true)
              .limit(1)
              .get()
              .then((querySnapshot) => {
                // worker hasn't done/claimed this tangram
                if (querySnapshot.empty) {
                  // no available
                  // or worker has done all available ones
                  alert(
                    "No available tangrams. Please wait for a few minutes and refresh."
                  );
                } else {
                  // claim new tangram
                  const doc = querySnapshot.docs[0].data();

                  file = doc.name + ".svg";
                  filesRef
                    .doc(file)
                    .set(
                      {
                        available: false,
                        lastClaimed: firebase.firestore.Timestamp.now(),
                        claimedWorkers:
                          firebase.firestore.FieldValue.arrayUnion(workerId),
                      },
                      { merge: true }
                    )
                    .then(() => {
                      //add to unfinished assignments
                      db.collection("assignments")
                        .doc(assignmentId)
                        .set(
                          {
                            unfinished: true,
                            file: file,
                            lastClaimed: firebase.firestore.Timestamp.now(),
                            workerId: workerId,
                            version: version,
                          },
                          { merge: true }
                        )
                        .then(() => {
                          // FIRST TIME set in userDoc
                          userDoc
                            .set(
                              {
                                claimed: [file],
                                assignmentId: [],
                              },
                              { merge: true }
                            )
                            .then(() => {
                              console.log("Tangram: ", file);
                              //start trial
                              startTrial(file);
                            });
                        });
                    });
                }
              });
          }
        })
        .catch((error) => {
          console.log("Error getting tangram ", error);
        });
    });
}

/** Prepare and start trial. */
function startTrial(id) {
  file = id;

  // Get the Object by ID
  var a = document.getElementById("tangramObj");
  a.setAttribute("data", "assets/" + file);
  // load tangram svg data
  a.onload = function () {
    // make sure svg is loaded;Get the SVG document inside the Object tag
    svgDoc = a.contentDocument;
    // Get one of the SVG items by ID;
    t1 = svgDoc.getElementById("1");
    t2 = svgDoc.getElementById("2");
    t3 = svgDoc.getElementById("3");
    t4 = svgDoc.getElementById("4");
    t5 = svgDoc.getElementById("5");
    t6 = svgDoc.getElementById("6");
    t7 = svgDoc.getElementById("7");

    // select all for whole annotation
    t1.setAttribute("fill", "gray");
    t2.setAttribute("fill", "gray");
    t3.setAttribute("fill", "gray");
    t4.setAttribute("fill", "gray");
    t5.setAttribute("fill", "gray");
    t6.setAttribute("fill", "gray");
    t7.setAttribute("fill", "gray");

    t1.addEventListener(
      "click",
      function (event) {
        if (annotated[1] === "") {
          seleted(t1, selection[0]);
          selection[0] = !selection[0];
          validSubmit();
        }
      },
      false
    );
    t2.addEventListener(
      "click",
      function (event) {
        if (annotated[2] === "") {
          seleted(t2, selection[1]);
          selection[1] = !selection[1];
          validSubmit();
        }
      },
      false
    );
    t3.addEventListener(
      "click",
      function (event) {
        if (annotated[3] === "") {
          seleted(t3, selection[2]);
          selection[2] = !selection[2];
          validSubmit();
        }
      },
      false
    );
    t4.addEventListener(
      "click",
      function (event) {
        if (annotated[4] === "") {
          seleted(t4, selection[3]);
          selection[3] = !selection[3];
          validSubmit();
        }
      },
      false
    );
    t5.addEventListener(
      "click",
      function (event) {
        if (annotated[5] === "") {
          seleted(t5, selection[4]);
          selection[4] = !selection[4];
          validSubmit();
        }
      },
      false
    );
    t6.addEventListener(
      "click",
      function (event) {
        if (annotated[6] === "") {
          seleted(t6, selection[5]);
          selection[5] = !selection[5];
          validSubmit();
        }
      },
      false
    );
    t7.addEventListener(
      "click",
      function (event) {
        if (annotated[7] === "") {
          seleted(t7, selection[6]);
          selection[6] = !selection[6];
          validSubmit();
        }
      },
      false
    );
    if (assignmentId === "ASSIGNMENT_ID_NOT_AVAILABLE") {
      wholeTrial();
    } else if (assignmentId && workerId && hitId) {
      db.collection("users")
        .doc(workerId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            d = doc.data();
            if ("completedQuestionnaire" in d) {
              // user did questionnaire
              // START TASK
              wholeTrial();
            } else {
              // user hasn't done questionnaire
              question();
            }
          } else {
            // first time user
            question();
          }
        });
    } else {
      wholeTrial();
    }
  };
}

/** Reset variables. */
function reset() {
  // reset params
  isPieceTrial = false;
  selection = [false, false, false, false, false, false, false];
  annotated = { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "" };
  ann_to_idx = {};
  metadata = {};
  lastid = 0;
  piece_to_color = {
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
  };
  piece_to_last_id = {
    1: -1,
    2: -1,
    3: -1,
    4: -1,
    5: -1,
    6: -1,
    7: -1,
  };
  wholeAnnotation = "";
  //clear output
  var list = document.getElementById("list");
  removeAllChildNodes(list);
}

/** Remove all child nodes of an element. */
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

/** Select a piece */
function seleted(t, sel) {
  if (isPieceTrial) {
    if (!sel) {
      t.setAttribute("fill", "gray");
    } else {
      t.setAttribute("fill", "lightgray");
    }
  }
}

/** Check if it's a valid annotation. */
function validSubmit() {
  if (isPieceTrial) {
    var text = document.getElementById("annotate");
    if (!selection.every((v) => v === false)) {
      text.disabled = false;
      text.focus();
    } else {
      text.value = "";
      text.disabled = true;
      text.blur();
    }
    //submit button
    var bt = document.getElementById("submit");

    var ann = text.value.replace(/[^a-zA-Z0-9]/g, ""); // to ensure it contains letters or numbers

    if (ann.length === 0 || selection.every((v) => v === false)) {
      bt.disabled = true;
    } else {
      bt.disabled = false;
    }

    //idk button
    var idk = document.getElementById("idk");

    if (selection.every((v) => v === false)) {
      idk.disabled = true;
    } else {
      idk.disabled = false;
    }
  }
}

/** Console logs */
function logging() {
  console.log(
    selection,
    annotated,
    ann_to_idx,
    metadata,
    piece_to_color,
    piece_to_last_id
  );
}
