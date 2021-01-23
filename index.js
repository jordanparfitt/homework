var allRows = [];

function load() {
  fetch("https://cd-static.bamgrid.com/dp-117731241344/home.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data.data.StandardCollection.containers.map(
        (container, containerIndex) => {
          if (container.set.items) {
            //map items
            createHeadingLabel(container.set.text);
            createCollectionRow(container.set, containerIndex);
          } else if (container.set.refId) {
            fetch(
              "https://cd-static.bamgrid.com/dp-117731241344/sets/" +
                container.set.refId +
                ".json"
            )
              .then((response) => {
                return response.json();
              })
              .then((response) => {
                if (response.data.CuratedSet) {
                  createHeadingLabel(response.data.CuratedSet.text);
                  createCollectionRow(response.data.CuratedSet, containerIndex);
                } else if (response.data.PersonalizedCuratedSet) {
                  createHeadingLabel(response.data.PersonalizedCuratedSet.text);
                  createCollectionRow(
                    response.data.PersonalizedCuratedSet,
                    containerIndex
                  );
                } else if (response.data.TrendingSet) {
                  createHeadingLabel(response.data.TrendingSet.text);
                  createCollectionRow(response.data.TrendingSet),
                    containerIndex;
                } else {
                  alert("theres another one");
                }
              });
          } else {
            alert("something is wrong");
          }
        }
      );
    });
}

function createCollectionRow(set, containerIndex) {
  var newRow = [];
  var collectionDiv = document.createElement("div");
  //todo: give the row an id
  //collectionDiv.setAttribute("id", "div" + containerIndex);
  collectionDiv.className = "collection-row";

  set.items.map((item, itemIndex) => {
    var img = createImage(item, containerIndex, itemIndex);
    newRow.push(img.id);
    collectionDiv.appendChild(img);
  });

  document.getElementById("imageContainer").appendChild(collectionDiv);
  allRows.push(newRow);
}

function createHeadingLabel(text) {
  var label = document.createElement("label");
  label.innerHTML = text.title.full.set.default.content;
  var labelDiv = document.createElement("div");
  labelDiv.appendChild(label);
  document.getElementById("imageContainer").appendChild(labelDiv);
}

function createImage(item, containerIndex, itemIndex) {
  var image178 = item.image.tile["1.78"];
  var url = "";
  var masterId = "";
  if (image178.series) {
    url = image178.series.default.url;
    masterId = image178.series.default.masterId;
  } else if (image178.program) {
    url = image178.program.default.url;
    masterId = image178.program.default.masterId;
  } else if (image178.default) {
    url = image178.default.default.url;
    masterId = image178.default.default.masterId;
  } else {
    alert(JSON.stringify(image178));
  }
  if (url) {
    var img = document.createElement("img");
    img.id = masterId + "-" + containerIndex + itemIndex;
    img.src = url;

    img.onerror = (err) => {
      img.src = "./img/stars.png";
    };

    return img;
  }
}

document.onkeydown = checkKey;
var targetImage;
function checkKey(e) {
  var newTargetImage;
  var scrollDirection;
  if (targetImage) {
    if (e.keyCode == "38") {
      //up
      var rect = targetImage.getBoundingClientRect();
      newTargetImage = document.elementFromPoint(rect.x + 10, rect.y - 75);
      scrollDirection = "vert";
    } else if (e.keyCode == "40") {
      //down
      var rect = targetImage.getBoundingClientRect();
      newTargetImage = document.elementFromPoint(
        rect.x + 10,
        rect.y + rect.height + 75
      );
      scrollDirection = "vert";
    } else if (e.keyCode == "37") {
      // left arrow
      if (targetImage.previousSibling) {
        newTargetImage = targetImage.previousSibling;
        scrollDirection = "horz";
      }
    } else if (e.keyCode == "39") {
      // right arrow
      if (targetImage.nextElementSibling) {
        newTargetImage = targetImage.nextElementSibling;
        scrollDirection = "horz";
      }
    }
  } else {
    newTargetImage = document.getElementById(allRows[0][0]);
  }

  if (newTargetImage && newTargetImage.tagName === "IMG") {
    [].forEach.call(document.querySelectorAll("img"), function (img) {
      img.className = "";
    });
    newTargetImage.className = "highlighted-image";
    targetImage = newTargetImage;
    if (scrollDirection === "vert") {
      targetImage.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    } else {
      targetImage.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }
}
