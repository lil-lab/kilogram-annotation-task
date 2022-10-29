/** Alert bad annotations. */
function reminders(selection, ann) {
  // check if selected all piece, alert
  // if (selection.every((v) => v === true)) {
  //   Swal.fire({
  //     title: "<strong>Reminder</strong>",
  //     icon: "info",
  //     html: `You are annotating the entire shape as a whole. We expect more granulated annotations to describe PARTS of the entire shape.<br/><br/>
  //   To correct this annotation, please remove it <button class="btn trash"><i class="fa fa-trash"></i></button> and re-annotate the parts.<br/><br/>
  //   You can revisit the tutorial in the qualification task <a href="https://tangram-dashboard.vercel.app/qual" target="_blank">here</a> (opens in a new tab).`,
  //     confirmButtonColor: "#4c7caf",
  //   });
  // }

  // check if ' and ' in annotation
  if (ann.includes(" and ")) {
    Swal.fire({
      title: "<strong>Reminder</strong>",
      icon: "info",
      html: `We found an "<strong>and</strong>" in your annotation. We expect separate annotations for different parts when possible.<br/><br/>
    To correct this annotation, please remove it <button class="btn trash"><i class="fa fa-trash"></i></button> and re-annotate the parts.<br/><br/>
    Ignore this if you think your annotation is correct (e.g. you can't further break your selection into smaller parts).<br/><br/>
    You can revisit the tutorial in the qualification task <a href="https://tangram-dashboard.vercel.app/qual" target="_blank">here</a> (opens in a new tab).`,
      confirmButtonColor: "#4c7caf",
    });
  }
}

/** Check if all parts are annotated the same as whole.*/
function allSameReminder() {
  var allSame = true;
  for (var i = 1; i <= 7; i++) {
    if (annotated[i] !== annotated[1]) {
      allSame = false;
      break;
    }
  }
  if (allSame) {
    Swal.fire({
      title: "<strong>Reminder</strong>",
      icon: "info",
      html: `You used the same annotation for each part. Try to identify different parts and use distinct annotations when possible.<br/><br/>
To correct this annotation, please remove it <button class="btn trash"><i class="fa fa-trash"></i></button> and re-annotate the parts.<br/><br/>
You can revisit the tutorial in the qualification task <a href="https://tangram-dashboard.vercel.app/qual" target="_blank">here</a> (opens in a new tab).`,
      confirmButtonColor: "#4c7caf",
    });
  }
}
