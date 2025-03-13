const multiThread = require('./functions');

const columFileA = 'CENTRO DE COSTO';
const newColumFileA = 'CLINICA';
const fileB = 'MIDASOFT.csv';
const colFindB = 'CCOSTO';
const colResultB = 'NOM CCOSTO';

module.exports = async function exe4() {
    await multiThread(columFileA, newColumFileA, fileB, colFindB, colResultB);
};

