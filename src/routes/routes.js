// Backend - server.js
import express from "express";
import cors from "cors";
import mysql from "mysql";
import crypto from "crypto";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pokebase",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to database as ID " + connection.threadId);
});

// Función para encriptar la contraseña con la sal
function encryptPassword(password, salt) {
  return crypto
    .createHash("sha256")
    .update(password + salt)
    .digest("hex");
}

// Ruta para iniciar sesión
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  connection.query(
    "SELECT * FROM users WHERE nickname = ?",
    [username],
    (error, results) => {
      if (error) {
        console.error("Error querying database: " + error.stack);
        res.status(500).json({ message: "Internal server error" });
        return;
      }

      if (results.length > 0) {
        const user = results[0];
        const hashedPassword = encryptPassword(password, user.salt);
        if (hashedPassword === user.password) {
          res.json({ message: "Login successful" });
        } else {
          res.status(401).json({ message: "Incorrect password" });
        }
      } else {
        res.status(401).json({ message: "User not found" });
      }
    }
  );
});

// Ruta para registrar un usuario
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const salt = crypto.randomBytes(8).toString("hex");
  const hashedPassword = encryptPassword(password, salt);
  connection.query(
    "INSERT INTO users (nickname, password, salt) VALUES (?, ?, ?)",
    [username, hashedPassword, salt],
    (error) => {
      if (error) {
        console.error("Error querying database: " + error.stack);
        res.status(500).json({ message: "Internal server error" });
        return;
      }
      res.json({ message: "User registered" });
    }
  );
});

//GET PKM Teams
app.get('/team', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).send('Username parameter is required');
  }

  // Updated query with LEFT JOINs for all pokemon
  const query = `
    SELECT
      u.nickname,
      p1.nombre AS pokemon1_nombre, p1.imagen AS pokemon1_imagen,
      p2.nombre AS pokemon2_nombre, p2.imagen AS pokemon2_imagen,
      p3.nombre AS pokemon3_nombre, p3.imagen AS pokemon3_imagen,
      p4.nombre AS pokemon4_nombre, p4.imagen AS pokemon4_imagen,
      p5.nombre AS pokemon5_nombre, p5.imagen AS pokemon5_imagen,
      p6.nombre AS pokemon6_nombre, p6.imagen AS pokemon6_imagen
    FROM users AS u
    INNER JOIN equipo_pokemon AS ep ON u.nickname = ep.id_usuario
    LEFT JOIN pokemon AS p1 ON ep.pokemon1_id = p1.id_pokemon
    LEFT JOIN pokemon AS p2 ON ep.pokemon2_id = p2.id_pokemon
    LEFT JOIN pokemon AS p3 ON ep.pokemon3_id = p3.id_pokemon
    LEFT JOIN pokemon AS p4 ON ep.pokemon4_id = p4.id_pokemon
    LEFT JOIN pokemon AS p5 ON ep.pokemon5_id = p5.id_pokemon
    LEFT JOIN pokemon AS p6 ON ep.pokemon6_id = p6.id_pokemon
    WHERE u.nickname = ?;
  `;

  // Execute query with user's nickname
  connection.query(query, [username], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({
        teams: results.map((team) => ({
          id_equipo: team.id_equipo,
          id_usuario: team.id_usuario,
          fecha_creacion: team.fecha_creacion,
          pokemons: [
            { nombre: team.pokemon1_nombre, imagen: team.pokemon1_imagen },
            { nombre: team.pokemon2_nombre, imagen: team.pokemon2_imagen },
            { nombre: team.pokemon3_nombre, imagen: team.pokemon3_imagen },
            { nombre: team.pokemon4_nombre, imagen: team.pokemon4_imagen },
            { nombre: team.pokemon5_nombre, imagen: team.pokemon5_imagen },
            { nombre: team.pokemon6_nombre, imagen: team.pokemon6_imagen },
          ],
        })),
      });
    }
  });
});



app.listen(port, () => {
  console.log(`API REST escuchando en el puerto ${port}`);
});
