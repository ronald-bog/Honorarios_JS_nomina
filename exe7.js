const multiThread = require('./functions');

const columFileA = 'ID PROFESIONAL';
const newColumFileA = 'CLASE NOMINA';
const fileB = 'MIDASOFT.csv';
const colFindB = 'DOCTO IDENT';
const colResultB = 'CLASE NOM';

module.exports = async function exe7() {
    await multiThread(columFileA, newColumFileA, fileB, colFindB, colResultB);
};
