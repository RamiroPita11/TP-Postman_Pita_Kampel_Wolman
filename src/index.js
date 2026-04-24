import express from "express";  // npm i express
import cors    from "cors";     // npm i cors

import { sumar, restar, multiplicar, dividir } from "./modules/matematica.js";
import { OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID } from "./modules/omdb-wrapper.js";
import Alumno from "./models/alumno.js";


const app  = express();
const port = 3000;               // http://localhost:3000

// === Middlewares ===
app.use(cors());                 // Habilita CORS (permite llamadas cross-origin)
app.use(express.json());         // Parsea bodies en formato JSON

const alumnosArray = [];
alumnosArray.push(new Alumno("Esteban Dido",   "22888444", 20));
alumnosArray.push(new Alumno("Matias Queroso", "28946255", 51));
alumnosArray.push(new Alumno("Elba Calao",     "32623391", 18));

// === Endpoints ===
app.get('/', (req, res) => {
  res.status(200).send('¡Ya estoy respondiendo!');
});

app.get('/saludar/:nombre', (req, res) => {
  const nombre = req.params.nombre;
  res.status(200).send(`Hola ${nombre}`);
});

app.get('/matematica/sumar', (req, res) => {
  const n1 = parseInt(req.query.n1);
  const n2 = parseInt(req.query.n2);

  res.status(200).send(String(sumar(n1, n2)));
});

app.get('/matematica/restar', (req, res) => {
  const n1 = parseInt(req.query.n1);
  const n2 = parseInt(req.query.n2);

  res.status(200).send(String(restar(n1, n2)));
});

app.get('/matematica/multiplicar', (req, res) => {
  const n1 = parseInt(req.query.n1);
  const n2 = parseInt(req.query.n2);

  res.status(200).send(String(multiplicar(n1, n2)));
});

app.get('/matematica/dividir', (req, res) => {
  const n1 = parseInt(req.query.n1);
  const n2 = parseInt(req.query.n2);

  if (n2 === 0) {
    return res.status(400).send("El divisor no puede ser cero");
  }

  res.status(200).send(String(dividir(n1, n2)));
});

app.get('/alumnos/:dni', (req, res) => {
const alumno = alumnosArray.find(a => String(a.dni) === String(req.params.dni));
  res.status(200).send(alumno);
});

app.post('/alumnos', (req, res) => {
  const { username, dni, edad } = req.body;

  if (!username || !dni || !edad) {
    return res.status(400).send("Datos incompletos");
  }

  alumnosArray.push(new Alumno(username, dni, edad));

  res.status(201).send("Creado");
});

app.delete('/alumnos', (req, res) => {
  const index = alumnosArray.findIndex(a => String(a.dni) === String(req.body.dni));

  if (index === -1) {
    return res.status(404).send("No encontrado");
  }

  alumnosArray.splice(index, 1);

  res.status(200).send("Eliminado");
});

app.get('/omdb/searchbypage', async (req, res) => {
  const { search, p } = req.query;

  try {
    const result = await OMDBSearchByPage(search, p);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      respuesta: false,
      cantidadTotal: 0,
      datos: []
    });
  }
});

app.get('/omdb/searchcomplete', async (req, res) => {
  const { search } = req.query;

  try {
    const result = await OMDBSearchComplete(search);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      respuesta: false,
      cantidadTotal: 0,
      datos: []
    });
  }
});

app.get('/omdb/getbyomdbid', async (req, res) => {
  const { imdbID } = req.query;

  try {
    const result = await OMDBGetByImdbID(imdbID);

    res.status(200).send(result);

  } catch (err) {
    res.status(500).send({
      respuesta: false,
      cantidadTotal: 0,
      datos: {}
    });
  }
});

// === Arranca el servidor ===
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});