const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static('public'));

try {
  process.loadEnvFile();
} catch (error) {
  // Ignorar error si el archivo .env no existe
}

const PORT = process.env.PORT || 3000;
const dataFilePath = path.join(__dirname, 'data', 'frutas.json');

/**
 * TODO: Implementar un endpoint GET /frutas
 * 1. Debe leer el archivo data/frutas.json utilizando fs.readFileSync o fs.promises.readFile.
 * 2. Debe parsear el contenido a un objeto de JavaScript (JSON.parse).
 * 3. Debe retornar el arreglo de frutas con un status 200.
 */
app.get('/frutas', (req, res) => {
  try {
    const contenido = fs.readFileSync(dataFilePath, 'utf-8');
    const listaFrutas = JSON.parse(contenido);
    return res.status(200).json(listaFrutas);
  } catch (error) {
    return res.status(500).json({ error: 'Error al leer el archivo de datos.' });
  }
});

/**
 * TODO: Implementar un endpoint GET /frutas/buscar
 * 1. Debe obtener el parámetro de consulta (query) 'nombre' (req.query.nombre).
 * 2. Debe leer el archivo data/frutas.json.
 * 3. Debe filtrar las frutas que contengan el nombre buscado (ignorando mayúsculas/minúsculas).
 * 4. Debe retornar el arreglo filtrado con status 200. Si no hay, retorna un arreglo vacío.
 * IMPORTANTE: ¡Esta ruta debe ir ANTES que la ruta GET /frutas/:id!
 */
app.get('/frutas/buscar', (req, res) => {
  try {
    const { nombre } = req.query;
    const contenido = fs.readFileSync(dataFilePath, 'utf-8');
    const listaFrutas = JSON.parse(contenido);

    if (!nombre) {
      return res.status(200).json(listaFrutas);
    }

    const filtradas = listaFrutas.filter((fruta) =>
      fruta.nombre.toLowerCase().includes(nombre.toLowerCase()),
    );

    return res.status(200).json(filtradas);
  } catch (error) {
    return res.status(500).json({ error: 'Error al buscar frutas.' });
  }
});

/**
 * TODO: Implementar un endpoint GET /frutas/:id
 * 1. Debe obtener el id de los parámetros de la url (req.params.id) y convertirlo a número.
 * 2. Debe leer el archivo data/frutas.json.
 * 3. Debe buscar la fruta que coincida con el id.
 * 4. Si la encuentra, retornarla con status 200.
 * * 5. Si no la encuentra, retornar un objeto { error: "Fruta no encontrada" } con status 404.
 */
app.get('/frutas/:id', (req, res) => {
  try {
    const { id } = req.params;
    const idNumero = parseInt(id, 10);

    const contenido = fs.readFileSync(dataFilePath, 'utf-8');
    const listaFrutas = JSON.parse(contenido);

    const frutaEncontrada = listaFrutas.find((f) => f.id === idNumero);

    if (!frutaEncontrada) {
      return res.status(404).json({ error: 'Fruta no encontrada' });
    }

    return res.status(200).json(frutaEncontrada);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener la fruta.' });
  }
});

/**
 * TODO: Implementar un endpoint POST /frutas
 * 1. Debe recibir un objeto en el body de la request (req.body) con los datos de la fruta (imagen, nombre, importe, stock).
 * 2. Debe leer el archivo data/frutas.json.
 * 3. Debe crear un nuevo id (el id máximo actual + 1).
 * 4. Debe agregar la nueva fruta al arreglo.
 * 5. Debe escribir el nuevo arreglo en el archivo data/frutas.json utilizando fs.writeFileSync o fs.promises.writeFile.
 * 6. Debe retornar la fruta creada con status 201.
 */
app.post('/frutas', (req, res) => {
  try {
    const { imagen, nombre, importe, stock } = req.body;

    const contenido = fs.readFileSync(dataFilePath, 'utf-8');
    const listaFrutas = JSON.parse(contenido);

    let maxId = 0;
    for (let i = 0; i < listaFrutas.length; i += 1) {
      if (listaFrutas[i].id > maxId) {
        maxId = listaFrutas[i].id;
      }
    }
    const nuevoId = maxId + 1;

    const nuevaFruta = {
      id: nuevoId,
      imagen,
      nombre,
      importe,
      stock,
    };

    listaFrutas.push(nuevaFruta);

    fs.writeFileSync(dataFilePath, JSON.stringify(listaFrutas, null, 2), 'utf-8');

    return res.status(201).json(nuevaFruta);
  } catch (error) {
    return res.status(500).json({ error: 'Error al guardar la fruta.' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    console.log(`Abre tu navegador en http://localhost:${PORT} para ver la interfaz web.`);
  });
}

module.exports = app;