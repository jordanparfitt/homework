export class DataCollection {
  constructor() {
    this.rows = [];
  }

  addRow(collection) {
    this.rows.push(collection);
  }

  getRows() {
    return this.rows;
  }

  getBestImage(row, column) {
    var activeItemJson = this.rows[row].items[column];
    //TODO: find better images
    if (activeItemJson.type === "DmcVideo") {
      if (activeItemJson.image.tile["0.75"]) {
        return activeItemJson.image.tile["0.75"].program.default.url;
      } else {
        return activeItemJson.image.hero_collection["1.78"].program.default.url;
      }
    }
    if (activeItemJson.type === "DmcSeries") {
      if (activeItemJson.image.tile["0.75"]) {
        return activeItemJson.image.tile["0.75"].series.default.url;
      } else {
        return activeItemJson.image.hero_collection["1.78"].series.default.url;
      }
    }
    if (activeItemJson.type === "StandardCollection") {
      return activeItemJson.image.tile["1.78"].default.default.url;
    }
  }
}
