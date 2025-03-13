const multiThread = require('./functions');

const columFileA = 'ID PROFESIONAL';
const newColumFileA = 'NOMBRE PROFESIONAL';
const fileB = 'MIDASOFT.csv';
const colFindB = 'DOCTO IDENT';
const colResultB = 'completos';

module.exports = async function exe6() {
    await multiThread(columFileA, newColumFileA, fileB, colFindB, colResultB);
};

