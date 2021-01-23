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
  var img = document.createElement("img");
  img.src = "./img/blank.png";
  collectionDiv.appendChild(img);

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

// document.onkeydown = checkKey;
// var currentVert = null;
// var currentHorizontal = null;
// function checkKey(e) {
//   if (!keyActive) {
//     keyActive = true;
//     e = e || window.event;
//     if (currentHorizontal != null && currentVert != null) {
//       if (e.keyCode == "38") {
//         // up arrow
//         if (currentVert > 0) currentVert--;
//       } else if (e.keyCode == "40") {
//         // down arrow
//         if (currentVert < allRows.length - 1) currentVert++;
//       } else if (e.keyCode == "37") {
//         // left arrow
//         if (currentHorizontal > 0) currentHorizontal--;
//       } else if (e.keyCode == "39") {
//         // right arrow
//         if (currentHorizontal < allRows[currentVert].length - 1)
//           currentHorizontal++;
//       }
//     } else {
//       currentVert = 0;
//       currentHorizontal = 0;
//     }

//     [].forEach.call(document.querySelectorAll("img"), function (img) {
//       img.className = "";
//     });
//     var targetImage = document.getElementById(
//       allRows[currentVert][currentHorizontal]
//     );
//     targetImage.className = "highlighted-image";

//     var rect = targetImage.getBoundingClientRect();
//     if (rect.x + 360 > screen.width) {
//       targetImage.parentElement.scroll({
//         left: targetImage.parentElement.scrollLeft + 360,
//         behavior: "smooth",
//       });
//     }
//     if (rect.x < 100) {
//       targetImage.parentElement.scroll({
//         left: targetImage.parentElement.scrollLeft - 360,
//         behavior: "smooth",
//       });
//     }
//   }
// }

document.onkeydown = checkKey;
var targetImage;
function checkKey(e) {
  e = e || window.event;
  if (targetImage) {
    if (e.keyCode == "38") {
      //up
      var rect = targetImage.getBoundingClientRect();
      targetImage = document.elementFromPoint(
        rect.x + 10,
        rect.y - rect.height
      );
    } else if (e.keyCode == "40") {
      //down
      var rect = targetImage.getBoundingClientRect();
      targetImage = document.elementFromPoint(
        rect.x + 10,
        rect.y + rect.height + 75
      );
    } else if (e.keyCode == "37") {
      // left arrow
      if (targetImage.previousSibling) {
      }
      targetImage = targetImage.previousSibling;
    } else if (e.keyCode == "39") {
      // right arrow
      if (
        targetImage.nextElementSibling &&
        !targetImage.nextElementSibling.src.includes("blank")
      )
        targetImage = targetImage.nextElementSibling;
    }
  } else {
    targetImage = document.getElementById(allRows[0][0]);
  }

  [].forEach.call(document.querySelectorAll("img"), function (img) {
    img.className = "";
  });
  targetImage.className = "highlighted-image";

  //scroll
  scroll();
}

function scroll() {
  var rect = targetImage.getBoundingClientRect();
  if (rect.x + 360 > screen.width) {
    targetImage.parentElement.scroll({
      left: targetImage.parentElement.scrollLeft + 360,
      behavior: "smooth",
    });
  }
  if (rect.x < 100) {
    targetImage.parentElement.scroll({
      left: targetImage.parentElement.scrollLeft - 360,
      behavior: "smooth",
    });
  }
  if (rect.y)
    targetImage.parentElement.parentElement.scroll({
      top: targetImage.parentElement.parentElement.scrollTop + 360,
      behavior: "smooth",
    });
  targetImage.parentElement.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest",
  });
}

// var targetImage;

// function checkKey(e) {
//   if (!targetImage) {
//     targetImage = document.getElementById(allRows[0][0]);
//   } else {
//     var rect = targetImage.getBoundingClientRect();
//     e = e || window.event;
//     if (e.keyCode == "38") {
//       //up
//       targetImage = document.elementFromPoint(
//         rect.x,
//         rect.y - rect.height - 75
//       );
//     } else if (e.keyCode == "40") {
//       //down
//       targetImage = document.elementFromPoint(
//         rect.x,
//         rect.y + rect.height + 75
//       );
//     } else if (e.keyCode == "37") {
//     } else if (e.keyCode == "39") {
//     }
//   }

//   if (targetImage) {
//     [].forEach.call(document.querySelectorAll("img"), function (img) {
//       img.className = "";
//     });
//     targetImage.className = "highlighted-image-gray";
//     targetImage.scrollIntoView({
//       block: "end",
//       inline: "center",
//       behavior: "smooth",
//     });
//   }
// }
