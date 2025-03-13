const multiThread = require('./functions');

const columFileA = 'PROCEDIMIENTO';
const newColumFileA = 'NOMBRE PROCEDIMIENTO';
const fileB = 'PLANES_TARIFARIOS.csv';
const colFindB = 'CODIGO Px';
const colResultB = 'NOMBRE Px';

module.exports = async function exe2() {
    await multiThread(columFileA, newColumFileA, fileB, colFindB, colResultB);
};

/* async function exeFiles() {
    for (const file of files) {
        await exe2(file.columFileA, file.newColumFileA, file.fileB, file.colFindB, file.colResultB);
    }
}
 */

/* const files = [
    {
        columFileA: 'PROCEDIMIENTO',
        newColumFileA: 'NOMBRE PROCEDIMIENTO',
        fileB: 'PLANES_TARIFARIOS.csv',
        colFindB: 'CODIGO Px',
        colResultB: 'NOMBRE Px'
    },
    {
        columFileA: 'SUBPROCEDIMIENTO',
        newColumFileA: 'NOMBRE SUBPROCEDIMIENTO',
        fileB: 'PLANES_TARIFARIOS.csv',
        colFindB: 'CODIGO SUBPx',
        colResultB: 'NOMBRE SUBPx'
    },
    {
        columFileA: 'CENTRO DE COSTO',
        newColumFileA: 'CLINICA',
        fileB: 'MIDASOFT.csv',
        colFindB: 'CCOSTO',
        colResultB: 'NOM CCOSTO'
    },
    {
        columFileA: 'ID PROFESIONAL',
        newColumFileA: 'ESPECIALIDAD PROFESIONAL',
        fileB: 'MIDASOFT.csv',
        colFindB: 'DOCTO IDENT',
        colResultB: 'NOM OFICIO'
    },
    {
        columFileA: 'ID PROFESIONAL',
        newColumFileA: 'NOMBRE PROFESIONAL',
        fileB: 'MIDASOFT.csv',
        colFindB: 'DOCTO IDENT',
        colResultB: 'completos'
    },
    {
        columFileA: 'ID PROFESIONAL',
        newColumFileA: 'CLASE NOMINA',
        fileB: 'MIDASOFT.csv',
        colFindB: 'DOCTO IDENT',
        colResultB: 'CLASE NOM'
    },
    {
        columFileA: 'CONCEPTO',
        newColumFileA: 'CONCEPTO HOMOLOGADO',
        fileB: 'PROPUESTA.csv',
        colFindB: 'CODIGO ERP',
        colResultB: 'CODIGO MIDASOFT'
    }
]; */
