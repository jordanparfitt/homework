"use strict";
class Nav {
  constructor(target) {
    this.activeTarget = target;
    this.activeTarget.className = "highlighted-image";
  }

  setActiveTarget(newTargetImage) {
    this.activeTarget = newTargetImage;
  }

  up() {
    var rect = this.activeTarget.getBoundingClientRect();
    var newTargetImage = document.elementFromPoint(rect.x + 10, rect.y - 75);
    if (newTargetImage) {
      this.setActiveTarget(newTargetImage);
      this.highlightAndScroll("vert");
    }
  }

  down() {
    var rect = this.activeTarget.getBoundingClientRect();
    var newTargetImage = document.elementFromPoint(
      rect.x + 10,
      rect.y + rect.height + 75
    );
    if (newTargetImage) {
      this.setActiveTarget(newTargetImage);
      this.highlightAndScroll("vert");
    }
  }

  left() {
    // left arrow
    if (this.activeTarget.previousSibling) {
      this.setActiveTarget(this.activeTarget.previousSibling);
      this.highlightAndScroll("horz");
    }
  }

  right() {
    if (this.activeTarget.nextElementSibling) {
      this.setActiveTarget(this.activeTarget.nextElementSibling);
      this.highlightAndScroll("horz");
    }
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
