const express = require('express');
const app = express();

app.set('puerto', 3000);
app.set('view engine', 'ejs');
app.set('views', './vistas');

// Sirve los archivos del frontend de forma estática
app.use(express.static('contenido_estatico'));

app.listen(app.get('puerto'), () => {
    console.log('Servidor corriendo en http://localhost:3000');
});