const fs = require('fs');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const csv = require('csv-parser');
const path = require('path');

function leerCSV(rutaArchivo) {
    return new Promise((resolve, reject) => {
        const resultados = [];
        fs.createReadStream(rutaArchivo)
            .pipe(csv({ separator: ';' }))
            .on('data', (data) => resultados.push(data))
            .on('end', () => resolve(resultados))
            .on('error', (error) => reject(error));
    });
}

function escribirCSV(rutaArchivo, datos) {
    return new Promise((resolve, reject) => {
        const campos = Object.keys(datos[0]);
        const csvData = [campos.join(';'), ...datos.map((row) => campos.map((campo) => row[campo] || '').join(';'))];
        fs.writeFile(rutaArchivo, csvData.join('\n'), 'utf8', (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

function procesarFragmento(datos, diccionarioResultados, columnaClaveBuscar, nuevaColumna) {
    return datos.map((fila) => {
        const clave = fila[columnaClaveBuscar];
        fila[nuevaColumna] = diccionarioResultados[clave] || 'No encontrado';
        return fila;
    });
}

if (isMainThread) {
    module.exports = async function main(columnaClaveBuscar, nuevaColumna, archivoResultado, colKeyFind, columnaResultado, archivoBuscar = 'result.csv', numWorkers = 4) {
        try {
            const datosBuscar = await leerCSV(path.join(process.cwd(), archivoBuscar));
            const datosResultado = await leerCSV(archivoResultado);
            const diccionarioResultados = Object.fromEntries(
                datosResultado.map((fila) => [fila[colKeyFind], fila[columnaResultado]])
            );

            const tamañoFragmento = Math.ceil(datosBuscar.length / numWorkers);
            const fragmentos = [];
            for (let i = 0; i < numWorkers; i++) {
                fragmentos.push(datosBuscar.slice(i * tamañoFragmento, (i + 1) * tamañoFragmento));
            }

            const workers = fragmentos.map((fragmento) => {
                return new Promise((resolve, reject) => {
                    const worker = new Worker(__filename, {
                        workerData: { fragmento, diccionarioResultados, columnaClaveBuscar, nuevaColumna },
                    });
                    worker.on('message', resolve);
                    worker.on('error', reject);
                    worker.on('exit', (code) => {
                        if (code !== 0) reject(new Error(`Worker finalizado con código ${code}`));
                    });
                });
            });

            const resultados = (await Promise.all(workers)).flat();
            await escribirCSV(archivoBuscar, resultados);

        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    };
} else {
    const { fragmento, diccionarioResultados, columnaClaveBuscar, nuevaColumna } = workerData;
    const resultado = procesarFragmento(fragmento, diccionarioResultados, columnaClaveBuscar, nuevaColumna);
    parentPort.postMessage(resultado);
}
