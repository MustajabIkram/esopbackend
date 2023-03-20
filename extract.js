const readXlsxFile = require('read-excel-file/node');
const path = require('path');

module.exports = function extract(name) {
  // File path.
  const data = readXlsxFile(path.join(__dirname, `../../tmp/${name}`)).then(
    (rows) => {
      // `rows` is an array of rows
      // each row being an array of cells.
      return rows;
    }
  );
  return data;
};
