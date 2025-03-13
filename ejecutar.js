/* const exe1 = require('./exe1');
const exe2 = require('./exe2');
const exe3 = require('./exe3');
const exe4 = require('./exe4');
const exe5 = require('./exe5');
const exe6 = require('./exe6');
const exe7 = require('./exe7');
const exe8 = require('./exe8');

async function ejecutarArchivosEnOrden() {
    console.log('Iniciando la ejecución secuencial de los archivos...');
    console.time('Tiempo Total:');
    await exe1();
    await exe2();
    await exe3();
    await exe4();
    await exe5();
    await exe6();
    await exe7();
    await exe8();

    console.log('Todos los archivos han sido ejecutados en orden.');
    console.timeEnd('Tiempo Total:');
}

ejecutarArchivosEnOrden().catch((err) => {
    console.error('Error durante la ejecución:', err);
});
 */

const cliProgress = require('cli-progress');

const exe1 = require('./exe1');
const exe2 = require('./exe2');
const exe3 = require('./exe3');
const exe4 = require('./exe4');
const exe5 = require('./exe5');
const exe6 = require('./exe6');
const exe7 = require('./exe7');
const exe8 = require('./exe8');

const archivos = [exe1, exe2, exe3, exe4, exe5, exe6, exe7, exe8];

async function ejecutarConBarraProgresiva(func, progressBar, incremento, total) {
    let progreso = 0;

    // Simular progreso fluido mientras se ejecuta la función
    const interval = setInterval(() => {
        if (progreso + incremento < total) {
            progreso += incremento;
            progressBar.increment(incremento);
        }
    }, 50); // Actualiza la barra cada 50ms

    // Ejecutar la función y detener el progreso
    await func();
    clearInterval(interval);

    // Completar el resto del progreso para este archivo
    progressBar.increment(total - progreso);
}

async function ejecutarArchivosEnOrden() {
    console.log('Iniciando la ejecución secuencial de los archivos...');
    console.time('Tiempo Total');

    // Crear barra de progreso
    const progressBar = new cliProgress.SingleBar({
        format: 'Progreso [{bar}] {spinner} {percentage}%  | ■',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
    });

    const spinnerChars = ['    ', '>   ', '>>  ', '>>> ', '>>>>', '>>> ', '>>  ', '>   ']; // Símbolos del spinner
    let spinnerIndex = 0;

    const totalProgreso = archivos.length;
    progressBar.start(totalProgreso, 0, { spinner: spinnerChars[spinnerIndex] }); // Iniciar la barra de progreso

    const spinnerInterval = setInterval(() => {
        spinnerIndex = (spinnerIndex + 1) % spinnerChars.length; // Actualizar el símbolo
        progressBar.update(progressBar.value, { spinner: spinnerChars[spinnerIndex] });
    }, 100); // Cambiar cada 100ms

    for (let i = 0; i < archivos.length; i++) {
        await ejecutarConBarraProgresiva(archivos[i], progressBar, 0.1, 1); // Incremento fluido
    }
    clearInterval(spinnerInterval);
    progressBar.stop(); // Detener la barra
    console.log('Todos los archivos han sido ejecutados en orden.');
    console.timeEnd('Tiempo Total');
}

ejecutarArchivosEnOrden().catch((err) => {
    console.error('Error durante la ejecución:', err);
});

/*
const cliProgress = require('cli-progress');

const exe1 = require('./exe1');
const exe2 = require('./exe2');
const exe3 = require('./exe3');
const exe4 = require('./exe4');
const exe5 = require('./exe5');
const exe6 = require('./exe6');
const exe7 = require('./exe7');
const exe8 = require('./exe8');

const archivos = [exe1, exe2, exe3, exe4, exe5, exe6, exe7, exe8];

async function ejecutarArchivosConSpinner() {
    console.log('Iniciando la ejecución secuencial de los archivos...');
    console.time('Tiempo Total');

    // Crear barra de progreso
    const progressBar = new cliProgress.SingleBar({
        format: 'Progreso [{bar}] {spinner} {percentage}%  | ■ ', // Spinner siempre activo
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
    });

    //const spinnerChars = ['|', '/', '--', '\\']; // Símbolos del spinner
    const spinnerChars = ['    ', '>   ', '>>  ', '>>> ', '>>>>', '>>> ', '>>  ', '>   ']; // Símbolos del spinner
    let spinnerIndex = 0;

    progressBar.start(archivos.length, 0, { spinner: spinnerChars[spinnerIndex] });

    // Intervalo para mantener el spinner girando
    const spinnerInterval = setInterval(() => {
        spinnerIndex = (spinnerIndex + 1) % spinnerChars.length; // Actualizar el símbolo
        progressBar.update(progressBar.value, { spinner: spinnerChars[spinnerIndex] });
    }, 100); // Cambiar cada 100ms

    // Ejecutar archivos en orden
    for (let i = 0; i < archivos.length; i++) {
        await archivos[i]();
        progressBar.increment(); // Incrementar la barra al finalizar cada archivo
    }

    clearInterval(spinnerInterval); // Detener el spinner
    progressBar.stop(); // Detener la barra

    console.log('Todos los archivos han sido ejecutados en orden.');
    console.timeEnd('Tiempo Total');
}

ejecutarArchivosConSpinner().catch((err) => {
    console.error('Error durante la ejecución:', err);
});
*/
