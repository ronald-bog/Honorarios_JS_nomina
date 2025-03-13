const multiThread = require('./functions');

const columFileA = 'CONCEPTO';
const newColumFileA = 'CONCEPTO HOMOLOGADO';
const fileB = 'PROPUESTA.csv';
const colFindB = 'CODIGO ERP';
const colResultB = 'CODIGO MIDASOFT';

module.exports = async function exe8() {
    await multiThread(columFileA, newColumFileA, fileB, colFindB, colResultB);
};
