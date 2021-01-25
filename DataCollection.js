"use strict";
class DataCollection {
  constructor() {
    this.rows = [];
  }

  addRow(collection) {
    this.rows.push(collection);
  }

  getRows() {
    return this.rows;
  }
}
