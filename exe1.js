const fs = require('fs');
const path = require('path');

const UNIFIED = 'unified.csv';
const RESULT = 'result.csv';

async function processFiles() {
    const archivos = [
        { input: 'gneg.csv', texto: 'GARANTIAS NEGATIVAS', tieneValor18: true },
        { input: 'hneg.csv', texto: 'HONORARIOS NEGATIVOS', tieneValor18: true },
        { input: 'hpos.csv', texto: 'HONORARIOS POSITIVOS', tieneValor18: false },
        { input: 'gpos.csv', texto: 'GARANTIAS POSITIVAS', tieneValor18: false }
    ];

    let allData = [];

    for (const archivo of archivos) {
        try {
            const data = await fs.promises.readFile(path.join(process.cwd(), archivo.input), 'utf8');
            const modifiedData = data
                .split('\r\n')
                .filter(line => line.trim() !== '') // Eliminar líneas vacías
                .map(line => {
                    const values = line.split(';');
                    if (archivo.tieneValor18) {
                        const value18 = values.splice(18, 1)[0] || 'N/A';
                        return `${values.join(';')};${archivo.texto};${value18}`;
                    } else {
                        return `${line};${archivo.texto};_`;
                    }
                })
                .join('\r\n');
            allData.push(modifiedData);
        } catch (err) {
            console.error(`Error al procesar el archivo ${archivo.input}:`, err);
        }
    }

    try {
        await fs.promises.writeFile(UNIFIED, allData.join('\r\n'), 'utf8');
    } catch (err) {
        console.error('Error al escribir el archivo de salida:', err);
    }
}

async function insertColumns() {
    try {
        const csvData = fs.readFileSync(UNIFIED, 'utf-8').trim();
        const rows = csvData.split(/\r?\n/).map(row => row.split(';'));
        const reorderedRows = rows.map((row, index) => {
            row.splice(6, 0, '');
            row.splice(8, 0, '');
            row.splice(24, 0, 'a1 ', 'a2 ', 'a3 ', 'a4 ', 'a5 ');
            return [...row];
        });
        reorderedRows.unshift(TITULOS);
        const newCsvData = reorderedRows.map(row => row.join(';')).join('\n');
        fs.writeFileSync(RESULT, newCsvData, 'utf-8');
    } catch (error) {
        console.error('Error al procesar el archivo:', error);
    }
}

const TITULOS = [
    "ID CONTRATO PROFESIONAL IS",
    "HONORARIO",
    "FECHA HONORARIO",
    "ID PACIENTE",
    "PLAN TARIFARIO",
    "PROCEDIMIENTO",
    "NOMBRE PROCEDIMIENTO",
    "SUBPROCEDIMIENTO",
    "NOMBRE SUBPROCEDIMIENTO",
    "ZONA",
    "UBICACIÓN",
    "VALOR EVOLUCION",
    "ESPECIALIDAD PROCEDIMIENTO",
    "FORMA PAGO",
    "ID PROFESIONAL",
    "CENTRO DE COSTO",
    "NIT",
    "CONCEPTO",
    "% HONORARIO",
    "VALOR CONTRATADO",
    "id honorario",
    "numero  contrato",
    "fecha  factura evolucion",
    "TIPO HONORARIO",
    "CLINICA",
    "ESPECIALIDAD PROFESIONAL",
    "NOMBRE PROFESIONAL",
    "CLASE NOMINA",
    "CONCEPTO HOMOLOGADO",
    "FECHA DEV"
];

module.exports = async function execute() {
    //async function execute() {
    ;
    //console.time('procesamiento');
    try {
        await processFiles();
        await insertColumns();
        fs.unlinkSync('unified.csv');
    } catch (error) {
        console.error('Error durante la ejecución:', error);
    }
    //console.timeEnd('procesamiento');
};


/*
const NEG_FILES = ['gneg1.csv', 'hneg1.csv'];
const COLUM_FILE = 'colum.csv';
const SEP_FILE = 'separator.csv';
const POS_FILES = ['gpos1.csv', 'hpos1.csv', 'colum.csv'];
const UNIFIED_FILE = 'unified.csv';
const UNIFIED_POS_FILE = 'unified_pos.csv';
const TIPO = [['hpos.csv', 'hpos1.csv', ';HONORARIOS POSITIVOS; '], ['gpos.csv', 'gpos1.csv', ';GARANTIAS POSITIVAS; '], ['gneg.csv', 'gneg1.csv', ';GARANTIAS NEGATIVAS'], ['hneg.csv', 'hneg1.csv', ';HONORARIOS NEGATIVOS']];

async function tipo() {
    for (const tipo of TIPO) {
        await new Promise((resolve, reject) => {
            const rl = readline.createInterface({
                input: fs.createReadStream(tipo[0]),
                output: fs.createWriteStream(tipo[1]),
                terminal: false
            });

            rl.on('line', (line) => {
                rl.output.write(`${line}${tipo[2]}\r\n`);
            });

            rl.on('close', () => {
                //console.log('Archivo modificado correctamente.');
                resolve();
            });

            rl.on('error', (err) => {
                reject(err);
            });
        });
    }
}

async function gneg() {
    const inputFile = 'gneg.csv'; // Reemplaza con la ruta de tu archivo CSV
    const outputFile = 'gneg1.csv';
    fs.readFile(inputFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return;
        }
        const modifiedData = data
            .split('\r\n') // Dividir el contenido en líneas
            .filter(line => line.trim() !== '') // Eliminar líneas vacías si existen
            .map(line => {
                const values = line.split(';'); // Dividir la línea en valores
                const value18 = values.splice(18, 1)[0] || 'N/A'; // Extraer el dato 18 (índice 17)
                return `${values.join(';')};GARANTIAS NEGATIVAS;${value18}`; // Reconstruir la línea con el valor 18 al final
            })
            .join('\r\n'); // Unir las líneas nuevamente

        // Escribir el archivo modificado
        fs.writeFile(outputFile, modifiedData, 'utf8', err => {
            if (err) {
                console.error('Error al escribir el archivo:', err);
            } else {
                console.log(`Archivo modificado guardado como ${outputFile}`);
            }
        });
    });
}
async function hneg() {
    const inputFile = 'hneg.csv'; // Reemplaza con la ruta de tu archivo CSV
    const outputFile = 'hneg1.csv'; // Ruta para guardar el archivo modificado

    fs.readFile(inputFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return;
        }

        // Procesar las líneas
        const modifiedData = data
            .split('\r\n') // Dividir el contenido en líneas
            .filter(line => line.trim() !== '') // Eliminar líneas vacías si existen
            .map(line => {
                const values = line.split(';'); // Dividir la línea en valores
                const value18 = values.splice(18, 1)[0] || 'N/A'; // Extraer el dato 18 (índice 17)
                return `${values.join(';')};HONORARIOS NEGATIVOS;${value18}`; // Reconstruir la línea con el valor 18 al final
            })
            .join('\r\n'); // Unir las líneas nuevamente

        // Escribir el archivo modificado
        fs.writeFile(outputFile, modifiedData, 'utf8', err => {
            if (err) {
                console.error('Error al escribir el archivo:', err);
            } else {
                console.log(`Archivo modificado guardado como ${outputFile}`);
            }
        });
    });
}

async function hpos() {
    const inputFile = 'hpos.csv'; // Reemplaza con la ruta de tu archivo CSV
    const outputFile = 'hpos1.csv';
    fs.readFile(inputFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return;
        }

        // Dividir el contenido en líneas y agregar la palabra al final de cada línea
        const modifiedData = data
            .split('\r\n') // Dividir el contenido en líneas
            .filter(line => line.trim() !== '') // Eliminar líneas vacías si existen
            .map(line => `${line};HONORARIOS POSITIVOS;_`) // Agregar al final de cada línea
            .join('\r\n'); // Unir las líneas nuevamente

        // Escribir el archivo modificado
        fs.writeFile(outputFile, modifiedData, 'utf8', err => {
            if (err) {
                console.error('Error al escribir el archivo:', err);
            } else {
                console.log(`Archivo modificado guardado como ${outputFile}`);
            }
        });
    });
}

async function gpos() {
    const inputFile = 'gpos.csv'; // Reemplaza con la ruta de tu archivo CSV
    const outputFile = 'gpos1.csv';
    fs.readFile(inputFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return;
        }

        // Dividir el contenido en líneas y agregar la palabra al final de cada línea
        const modifiedData = data
            .split('\r\n') // Dividir el contenido en líneas
            .filter(line => line.trim() !== '') // Eliminar líneas vacías si existen
            .map(line => `${line};HONORARIOS POSITIVOS;_`) // Agregar al final de cada línea
            .join('\r\n'); // Unir las líneas nuevamente

        // Escribir el archivo modificado
        fs.writeFile(outputFile, modifiedData, 'utf8', err => {
            if (err) {
                console.error('Error al escribir el archivo:', err);
            } else {
                console.log(`Archivo modificado guardado como ${outputFile}`);
            }
        });
    });
}

const FILES = ['hpos1.csv', 'hneg1.csv', 'gpos1.csv', 'gneg1.csv'];
const archivoSalida = 'archivoUnido.csv';

async function unirArchivos() {
    try {
        let contenidoCompleto = '';

        for (const archivo of FILES) {
            // Leer el contenido de cada archivo
            const contenido = await fs.readFile(archivo, 'utf8'); // Leer archivo sin eliminar saltos
            contenidoCompleto += contenido + '\r\n'; // Agregar contenido al completo con un salto de línea al final
        }

        // Escribir el contenido combinado en el archivo de salida
        await fs.writeFile(archivoSalida, contenidoCompleto.trim(), 'utf8'); // Guardar el contenido
        console.log(`Archivos unidos correctamente en: ${archivoSalida}`);
    } catch (err) {
        console.error('Error al procesar los archivos:', err);
    }
}

function unifyNegFiles() {
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(UNIFIED_FILE, { flags: 'w' });
        NEG_FILES.forEach((file, index) => {
            const data = fs.readFileSync(file, 'utf-8');
            writeStream.write(data);
        });

        writeStream.end();
        writeStream.on('finish', () => {
            //console.log(`Paso 1=> Archivos negativos unificados en: ${UNIFIED_FILE}`);
            resolve();
        });

        writeStream.on('error', (err) => {
            reject(err);
        });
    });
};

function unifyNegFiles() {
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(UNIFIED_FILE, { flags: 'w' });

        NEG_FILES.forEach((file, index) => {
            const readStream = fs.createReadStream(file, 'utf-8');
            const rl = readline.createInterface({
                input: readStream,
                output: writeStream,
                terminal: false
            });

            rl.on('line', (line) => {
                // Añadir 'negativo' al final de cada línea
                writeStream.write(`${line} ;negativo\n`);
            });

            rl.on('close', () => {
                if (index === NEG_FILES.length - 1) {
                    writeStream.end();
                }
            });

            rl.on('error', (err) => {
                reject(err);
            });
        });

        writeStream.on('finish', () => {
            console.log(`Paso 1=> Archivos negativos unificados en: ${UNIFIED_FILE}`);
            resolve();
        });

        writeStream.on('error', (err) => {
            reject(err);
        });
    });
} 

    function unifyPosFiles() {
        return new Promise((resolve, reject) => {
            const writeStream = fs.createWriteStream(UNIFIED_POS_FILE, { flags: 'w' });
            POS_FILES.forEach((file, index) => {
                const data = fs.readFileSync(file, 'utf-8');
                writeStream.write(data);
            });
    
            writeStream.end();
            writeStream.on('finish', () => {
                //console.log(`Paso 3 => Archivos negativos y positivos unificados en: ${UNIFIED_POS_FILE}`);
                resolve();
            });
    
            writeStream.on('error', (err) => {
                reject(err);
            });
        });
    };
    
    async function moveColS() {
        try {
            const csvData = fs.readFileSync(UNIFIED_FILE, 'utf-8').trim();
            const rows = csvData.split(/\r?\n/).map(row => row.split(';'));
            const columnSIndex = 18;
            const reorderedRows = rows.map((row) => {
                const columnS = row.splice(columnSIndex, 1);
                return [...row, ...columnS];
            });
            const newCsvData = reorderedRows.map(row => row.join(';')).join('\r\n');
            fs.writeFileSync(COLUM_FILE, newCsvData, 'utf-8');
            //console.log(`Paso 2 => Columna 'S' movida`);
        } catch (error) {
            console.error('Error al procesar el archivo:', error);
        }
    }
    
async function execute() {
    ;
    //  console.time('procesamiento');
    try {
        await procesarArchivos();
        //await tipo();
        //await unifyNegFiles();
        //await moveColS();
        //await unifyPosFiles();
        await insertColumns();
        //await csvToXlsx();
        //fs.unlinkSync(UNIFIED_FILE);
        //fs.unlinkSync(COLUM_FILE);
        //fs.unlinkSync(UNIFIED_POS_FILE);
        //fs.unlinkSync('gneg1.csv');
        //fs.unlinkSync('hneg1.csv');
        //fs.unlinkSync('gpos1.csv');
        //fs.unlinkSync('hpos1.csv');
    } catch (error) {
        console.error('Error durante la ejecución:', error);
    }
    // console.timeEnd('procesamiento');
};
execute();

const xlsxFilePath = 'archivo.xlsx';

async function csvToXlsx() {
    try {
        const csvData = fs.readFileSync(SEP_FILE, 'utf-8');
        const rows = csvData.split('\n').map(row => row.split(';'));
        const workbook = await XlsxPopulate.fromBlankAsync();
        const sheet = workbook.sheet(0);
        rows.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                sheet.cell(rowIndex + 1, colIndex + 1).value(cell); // Las filas y columnas empiezan en 1
            });
        });
        await workbook.toFileAsync(xlsxFilePath);
        console.log(`Archivo XLSX guardado en: ${xlsxFilePath}`);
    } catch (error) {
        console.error('Error al procesar el archivo:', error);
    }
}
*/