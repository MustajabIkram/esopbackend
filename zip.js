const AdmZip = require('adm-zip');
const path = require('path');
module.exports = async function createZipArchive(ID) {
  const zip = new AdmZip();
  const outputFile = `../../tmp/res${ID}.zip`;
  zip.addLocalFolder(path.join(__dirname, `../../tmp/output${ID}`));
  const data = zip.toBuffer();
  zip.writeZip(path.join(__dirname, outputFile));
  return data;
};
