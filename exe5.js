const multiThread = require('./functions');

const columFileA = 'ID PROFESIONAL';
const newColumFileA = 'ESPECIALIDAD PROFESIONAL';
const fileB = 'MIDASOFT.csv';
const colFindB = 'DOCTO IDENT';
const colResultB = 'NOM OFICIO';

module.exports = async function exe5() {
    await multiThread(columFileA, newColumFileA, fileB, colFindB, colResultB);
};

