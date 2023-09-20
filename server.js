const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser'); // Middleware para analizar los datos del formulario
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); // Middleware para analizar los datos del formulario

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/crearEvento', (req, res) => {
  const { fecha, titulo, descripcion } = req.body;

  if (!fecha || !titulo || !descripcion) {
    return res.status(400).send('Falta información requerida');
  }

  // Crear un directorio con el nombre de la fecha dentro de 'public'
  const directorioFecha = path.join(__dirname, 'public', 'directorio-de-eventos', fecha);

  // Crear un archivo de texto con el nombre del título y poner la descripción dentro
  const archivoNombre = path.join(directorioFecha, titulo + '.txt');

  const contenido = `Título: ${titulo}\nDescripción: ${descripcion}`;

  fs.mkdir(directorioFecha, { recursive: true }, (err) => {
    if (err) {
      console.error('Error al crear el directorio:', err);
      return res.status(500).send('Error interno del servidor');
    }

    fs.writeFile(archivoNombre, contenido, (err) => {
      if (err) {
        console.error('Error al crear el archivo:', err);
        return res.status(500).send('Error interno del servidor');
      }

      console.log('Directorio y archivo creados:', directorioFecha, archivoNombre);
      res.status(200).send('Evento creado correctamente');
    });
  });
});


// Ruta para cargar las carpetas disponibles
app.get('/carpetasDisponibles', (req, res) => {
    // Lee el contenido del directorio de eventos
    // Directorio donde se almacenan las carpetas
  const directorioEventos = path.join(__dirname, 'public', 'directorio-de-eventos');

    fs.readdir(directorioEventos, (err, carpetas) => {
        if (err) {
            console.error('Error al leer el directorio de eventos:', err);
            return res.status(500).send('Error interno del servidor');
        }
        // Envía la lista de carpetas como respuesta en formato JSON
        res.json({ carpetas: carpetas });
    });
});


// Ruta para cargar los archivos de una carpeta seleccionada
app.get('/contenidoCarpeta', (req, res) => {
  const carpetaSeleccionada = req.query.carpeta;

  const directorioEventos = path.join(__dirname, 'public', 'directorio-de-eventos');

  const rutaCarpeta = path.join(directorioEventos, carpetaSeleccionada);

  // Leer el contenido de la carpeta y enviarlo como respuesta en formato JSON
  fs.readdir(rutaCarpeta, (err, contenido) => {
      if (err) {
          console.error('Error al leer el contenido de la carpeta:', err);
          return res.status(500).send('Error interno del servidor');
      }
      res.json({ contenido: contenido });
  });
});



// Ruta para obtener el contenido de un archivo
app.get('/contenidoArchivo', (req, res) => {
  const carpetaSeleccionada = req.query.carpeta;
  const archivoSeleccionado = req.query.archivo;

  const directorioEventos = path.join(__dirname, 'public', 'directorio-de-eventos');

  // Componer la ruta completa al archivo dentro de la carpeta seleccionada
  const rutaArchivo = path.join(directorioEventos, carpetaSeleccionada, archivoSeleccionado);

  // Leer el contenido del archivo y enviarlo como respuesta en formato JSON
  fs.readFile(rutaArchivo, 'utf8', (err, contenido) => {
      if (err) {
          console.error('Error al leer el archivo:', err);
          return res.status(500).send('Error interno del servidor');
      }
      res.json({ contenido: contenido });
  });
});


// Ruta para guardar el contenido editado de un archivo
app.post('/guardarArchivo', (req, res) => {
  const carpetaSeleccionada = req.body.carpeta;
  const archivoSeleccionado = req.body.archivo;
  const nuevoContenido = req.body.contenido;

  const directorioEventos = path.join(__dirname, 'public', 'directorio-de-eventos');

  const rutaArchivo = path.join(directorioEventos, carpetaSeleccionada, archivoSeleccionado);

  // Escribe el nuevo contenido en el archivo
  fs.writeFile(rutaArchivo, nuevoContenido, 'utf8', (err) => {
      if (err) {
          console.error('Error al guardar el archivo:', err);
          return res.status(500).send('Error interno del servidor');
      }
      res.status(200).send('Archivo guardado correctamente');
  });
});


app.listen(port, () => {
  console.log(`El servidor está escuchando en el puerto ${port}`);
});
