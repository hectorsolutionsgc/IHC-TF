const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

const RUTA_JSON = path.join(__dirname, '..', 'data', 'reportes.json');

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'app')));
app.use('/styles', express.static(path.join(__dirname, '..', 'styles')));
app.use('/js', express.static(path.join(__dirname, '..', 'js')));
app.use('/data', express.static(path.join(__dirname, '..', 'data')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'app', 'login.html'));
});

app.get('/reportes', (req, res) => {
  const data = fs.readFileSync(RUTA_JSON, 'utf-8');
  res.json(JSON.parse(data));
});

app.post('/reportes', (req, res) => {
  try {
    const nuevo = req.body;
    const archivo = fs.readFileSync(RUTA_JSON, 'utf-8');
    const reportes = JSON.parse(archivo);

    const nuevoId = reportes.length > 0 ? reportes[reportes.length - 1].id + 1 : 1;

    const reporteFinal = {
      id: nuevoId,
      tipo: nuevo.tipo,
      descripcion: nuevo.descripcion,
      lat: nuevo.lat,
      lng: nuevo.lng,
      fecha: new Date().toISOString(),
      usuario: {
        nombre: nuevo.usuario.nombre,
        correo: nuevo.usuario.correo
      }
    };

    reportes.push(reporteFinal);
    fs.writeFileSync(RUTA_JSON, JSON.stringify(reportes, null, 2));

    res.status(201).json({ mensaje: 'Reporte guardado', reporte: reporteFinal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al guardar el reporte' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
