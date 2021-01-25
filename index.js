var masterData = new DataCollection();

function load() {
  var addtionalUrls = [];
  //first search
  fetch("https://cd-static.bamgrid.com/dp-117731241344/home.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      //
      data.data.StandardCollection.containers.map((container) => {
        //add standard collections to the masterData
        if (container.set.items) {
          masterData.addRow(container.set);
        } else if (container.set.refId) {
          //add the dynamic sets to an array for a new promise
          addtionalUrls.push(
            fetch(
              "https://cd-static.bamgrid.com/dp-117731241344/sets/" +
                container.set.refId +
                ".json"
            )
          );
        }
      });
    })
    .then(() => {
      //get dynamicRefSets
      Promise.all(addtionalUrls)
        .then(function (responses) {
          return Promise.all(
            responses.map(function (response) {
              return response.json();
            })
          );
        })
        .then(function (dynamicRefSets) {
          //add dynamicRefSets to masterData
          dynamicRefSets.map((set) => {
            masterData.addRow(findItemsInSet(set.data));
          });
        })
        .then(function () {
          //loop through master data and create UI
          masterData.getRows().map((container, containerIndex) => {
            createHeadingLabel(container.text);
            createCollectionRow(container, containerIndex);
          });
          //create nav class
          nav = new Nav(
            document.getElementById(
              "imageContainer"
            ).childNodes[1].childNodes[0]
          );
        })
        .catch(function (error) {
          console.log(error);
        });
    });
}

function findItemsInSet(data) {
  if (data.CuratedSet) {
    return data.CuratedSet;
  } else if (data.PersonalizedCuratedSet) {
    return data.PersonalizedCuratedSet;
  } else if (data.TrendingSet) {
    return data.TrendingSet;
  }
}

function createCollectionRow(set, containerIndex) {
  var newRow = [];
  var collectionDiv = document.createElement("div");
  collectionDiv.className = "collection-row";

  set.items.map((item, itemIndex) => {
    var img = createImage(item, containerIndex, itemIndex);
    newRow.push(img.id);
    collectionDiv.appendChild(img);
  });

  document.getElementById("imageContainer").appendChild(collectionDiv);
}

function createHeadingLabel(text) {
  var label = document.createElement("label");
  label.innerHTML = text.title.full.set.default.content;
  label.className = "heading-label";
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
  }
  if (url) {
    var img = document.createElement("img");
    img.id = masterId + "-" + containerIndex + "-" + itemIndex;
    img.src = url;

    img.onerror = (err) => {
      img.src = "./img/image-not-found.jpg";
    };

    return img;
  }
}

document.onkeydown = checkKey;
var nav;
function checkKey(e) {
  //any key closes modal
  if (document.getElementById("previewModal").style.display === "block") {
    document.getElementById("previewModal").style.display = "none";
    document.getElementById("previewImage").src = "";
  } else {
    switch (e.keyCode) {
      case 38:
        nav.up();
        break;
      case 40:
        nav.down();
        break;
      case 37:
        nav.left();
        break;
      case 39:
        nav.right();
        break;
      case 13:
        nav.enter();
        break;
      default:
    }
  }
}
