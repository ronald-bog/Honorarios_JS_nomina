const multiThread = require('./functions');

const columFileA = 'SUBPROCEDIMIENTO';
const newColumFileA = 'NOMBRE SUBPROCEDIMIENTO';
const fileB = 'PLANES_TARIFARIOS.csv';
const colFindB = 'CODIGO SUBPx';
const colResultB = 'NOMBRE SUBPx';

module.exports = async function exe3() {
    await multiThread(columFileA, newColumFileA, fileB, colFindB, colResultB);
};
