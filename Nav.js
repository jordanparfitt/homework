export class Nav {
  constructor(target) {
    this.activeTarget = target;
    this.activeTarget.className = "highlighted-image";
    this.setNavLabel();
  }

  getActiveTarget(newTargetImage) {
    return this.activeTarget;
  }

  setActiveTarget(newTargetImage) {
    this.activeTarget = newTargetImage;
  }

  up() {
    var rect = this.activeTarget.getBoundingClientRect();
    //TODO: Loop through sibling and find closest image
    var newTargetImage = document.elementFromPoint(rect.x + 10, rect.y - 75);
    if (newTargetImage && newTargetImage.tagName === "IMG") {
      this.setActiveTarget(newTargetImage);
      this.highlightAndScroll("vert");
      this.setNavLabel();
    }
  }

  down() {
    var rect = this.activeTarget.getBoundingClientRect();
    //TODO: Loop through sibling and find closest image
    var newTargetImage = document.elementFromPoint(
      rect.x + 10,
      rect.y + rect.height + 75
    );
    if (newTargetImage && newTargetImage.tagName === "IMG") {
      this.setActiveTarget(newTargetImage);
      this.highlightAndScroll("vert");
      this.setNavLabel();
    }
  }

  left() {
    // left arrow
    if (this.activeTarget.previousSibling) {
      this.setActiveTarget(this.activeTarget.previousSibling);
      this.highlightAndScroll("horz");
      this.setNavLabel();
    }
  }

  right() {
    if (this.activeTarget.nextElementSibling) {
      this.setActiveTarget(this.activeTarget.nextElementSibling);
      this.highlightAndScroll("horz");
      this.setNavLabel();
    }
  }

  setNavLabel() {
    var idArray = this.activeTarget.id.split("-");
    var activeItemJson = masterData.rows[idArray[1]].items[idArray[2]];
    var currentSelectionLabel = document.getElementById(
      "currentSelectionLabel"
    );
    if (activeItemJson.type === "StandardCollection") {
      currentSelectionLabel.innerHTML =
        activeItemJson.text.title.full.collection.default.content;
    }
    if (activeItemJson.type === "DmcSeries") {
      currentSelectionLabel.innerHTML =
        activeItemJson.text.title.full.series.default.content;
    }
    if (activeItemJson.type === "DmcVideo") {
      currentSelectionLabel.innerHTML =
        activeItemJson.text.title.full.program.default.content;
    }
  }

  enter() {
    var idArray = this.activeTarget.id.split("-");
    document.getElementById("modalImage").src = masterData.getBestImage(
      idArray[1],
      idArray[2]
    );
    document.getElementById("previewModal").style.display = "block";
  }

  highlightAndScroll(scrollDirection) {
    [].forEach.call(document.querySelectorAll("img"), function (img) {
      img.className = "";
    });
    this.activeTarget.className = "highlighted-image";
    if (scrollDirection === "vert") {
      this.activeTarget.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
    if (scrollDirection === "horz") {
      this.activeTarget.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }
}
