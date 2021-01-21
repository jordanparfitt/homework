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
            createCollectionRow(container.set);
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
                  createCollectionRow(response.data.CuratedSet);
                } else if (response.data.PersonalizedCuratedSet) {
                  createHeadingLabel(response.data.PersonalizedCuratedSet.text);
                  createCollectionRow(response.data.PersonalizedCuratedSet);
                } else if (response.data.TrendingSet) {
                  createHeadingLabel(response.data.TrendingSet.text);
                  createCollectionRow(response.data.TrendingSet);
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

function createCollectionRow(set) {
  var collectionDiv = document.createElement("div");
  //todo: give the row an id
  //collectionDiv.setAttribute("id", "div" + containerIndex);
  collectionDiv.className = "collection-row";

  set.items.map((item) => {
    var img = createImage(item);
    img.className = "thumbnail-image";
    collectionDiv.appendChild(img);
  });
  document.getElementById("body").appendChild(collectionDiv);
}

function createHeadingLabel(text) {
  var label = document.createElement("label");
  label.innerHTML = text.title.full.set.default.content;
  var labelDiv = document.createElement("div");
  labelDiv.appendChild(label);
  document.getElementById("body").appendChild(labelDiv);
}

function createImage(item) {
  var image178 = item.image.tile["1.78"];
  var url = "";
  if (image178.series) {
    url = image178.series.default.url;
  } else if (image178.program) {
    url = image178.program.default.url;
  } else if (image178.default) {
    url = image178.default.default.url;
  } else {
    alert(JSON.stringify(image178));
  }
  if (url) {
    var img = document.createElement("img");
    img.src = url;
    return img;
  }
}
