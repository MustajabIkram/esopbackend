const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const path = require('path');
const fs = require('fs');

module.exports = function core(name, data, ID) {
  // Load the docx file as binary content
  const content = fs.readFileSync(
    path.join(__dirname, `../../tmp/${name}`),
    'binary'
  );
  const keys = data[0];

  for (let index = 1; index < data.length; index++) {
    const zip = new PizZip(content);
    const values = data[index];
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
    doc.render(mapMyKeys(keys, values));

    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: 'DEFLATE',
    });

    // buf is a nodejs Buffer, you can either write it to a
    // file or res.send it with express for example.
    fs.writeFileSync(path.join(__dirname, `../../tmp/output-${ID}.docx`), buf);
  }
};

const mapMyKeys = (keys, values) => {
  let resObj = {};
  for (let index = 0; index < keys.length; index++) {
    resObj = {
      ...resObj,
      [keys[index]]: [values[index]],
    };
  }
  return resObj;
};
