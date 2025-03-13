<?php
// Conectar a la base de datos de ProcessMaker
$db = config('database.connections.mysql');
$pdo = new PDO("mysql:host={$db['host']};dbname={$db['database']}", $db['username'], $db['password']);

// Definir la fecha de inicio (1 de noviembre de 2024)
$fechaInicio = '2024-11-01 00:00:00';

// Consulta para seleccionar los casos creados desde la fecha indicada
$query = "SELECT APP_UID, APP_TITLE, APP_CREATE_DATE FROM APP_CACHE_VIEW WHERE APP_CREATE_DATE >= :fechaInicio";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':fechaInicio', $fechaInicio);
$stmt->execute();

// Obtener los resultados
$casos = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Mostrar los casos encontrados
if (count($casos) > 0) {
    echo "<h3>Casos encontrados:</h3>";
    echo "<table border='1'>";
    echo "<tr><th>ID del Caso</th><th>Título</th><th>Fecha de Creación</th></tr>";
    foreach ($casos as $caso) {
        echo "<tr>";
        echo "<td>" . $caso['APP_UID'] . "</td>";
        echo "<td>" . $caso['APP_TITLE'] . "</td>";
        echo "<td>" . $caso['APP_CREATE_DATE'] . "</td>";
        echo "</tr>";
    }
    echo "</table>";

    // Preguntar si se desea eliminar los casos
    // echo "<br><form method='post'>";
    // echo "<input type='submit' name='eliminar' value='Eliminar todos los casos'>";
    // echo "</form>";

    // Procesar la eliminación si se confirma
    // if (isset($_POST['eliminar'])) {
    //     $deleteQuery = "DELETE FROM APP_CACHE_VIEW WHERE APP_CREATE_DATE >= :fechaInicio";
    //     $deleteStmt = $pdo->prepare($deleteQuery);
    //     $deleteStmt->bindParam(':fechaInicio', $fechaInicio);
    //     $deleteStmt->execute();

    //     echo "<p style='color: green;'>Todos los casos han sido eliminados correctamente.</p>";
    // }
} else {
    echo "<p>No se encontraron casos creados desde el 1 de noviembre de 2024.</p>";
}
?>