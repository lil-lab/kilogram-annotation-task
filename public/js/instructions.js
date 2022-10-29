window.showTutorial = function () {
  Swal.fire({
    title: "<strong>Instructions</strong>",
    icon: "question",
    html: `
      1. Select one or more tangram pieces you want to label as a meaningful part.<br/>
      2. Type in the annotation.<br/>
      3. If it's a new annotation, click "<b>Annotate</b>" or hit ENTER key.<br/>
      4. Delete an annotation by clicking the "<b>X</b>" next to the annotation.<br/>
      5. When all pieces are annotated, click "<b>Submit</b>" or hit SHIFT key to go to the next tangram.<br/>
      <br/>
      <b>Note:</b><br/>
      If the annotation already exists, <br/>
      (1) "<b>Add to Group</b>" will be prompted to add the new piece into the existing annation group; <br/>
      OR<br/>
      (2) <i>if this annotation is a new group but with the same name</i>
      (e.g. "leg" for each of the two legs of a bird), 
      use distinguishable annotations (e.g. left leg/right leg) 
      or add numeric indicators (e.g. leg1/leg2).`,
    showCloseButton: true,
    focusConfirm: false,
    confirmButtonText: "Got it!",
    confirmButtonColor: "#4caf50",
  });
};
