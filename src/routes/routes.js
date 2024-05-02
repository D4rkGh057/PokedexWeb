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

//PKM TEAMS ROUTES
//GET PKM Teams
app.get("/team", (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).send("Username parameter is required");
  }

  // Updated query with LEFT JOINs for all pokemon and added id_pokemon selections
  const query = `
    SELECT
      u.nickname,
      ep.id_equipo,
      p1.id_pokemon AS pokemon1_id, p1.nombre AS pokemon1_nombre, p1.imagen AS pokemon1_imagen,
      p2.id_pokemon AS pokemon2_id, p2.nombre AS pokemon2_nombre, p2.imagen AS pokemon2_imagen,
      p3.id_pokemon AS pokemon3_id, p3.nombre AS pokemon3_nombre, p3.imagen AS pokemon3_imagen,
      p4.id_pokemon AS pokemon4_id, p4.nombre AS pokemon4_nombre, p4.imagen AS pokemon4_imagen,
      p5.id_pokemon AS pokemon5_id, p5.nombre AS pokemon5_nombre, p5.imagen AS pokemon5_imagen,
      p6.id_pokemon AS pokemon6_id, p6.nombre AS pokemon6_nombre, p6.imagen AS pokemon6_imagen
    FROM users AS u
    INNER JOIN equipo_pokemon AS ep ON u.id = ep.id_usuario
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
      res.status(500).send("Internal Server Error");
    } else {
      res.json({
        teams: results.map((team) => ({
          id_equipo: team.id_equipo,
          id_usuario: team.id_usuario,
          fecha_creacion: team.fecha_creacion,
          pokemons: [
            {
              id: team.pokemon1_id,
              name: team.pokemon1_nombre,
              image: team.pokemon1_imagen,
            },
            {
              id: team.pokemon2_id,
              name: team.pokemon2_nombre,
              image: team.pokemon2_imagen,
            },
            {
              id: team.pokemon3_id,
              name: team.pokemon3_nombre,
              image: team.pokemon3_imagen,
            },
            {
              id: team.pokemon4_id,
              name: team.pokemon4_nombre,
              image: team.pokemon4_imagen,
            },
            {
              id: team.pokemon5_id,
              name: team.pokemon5_nombre,
              image: team.pokemon5_imagen,
            },
            {
              id: team.pokemon6_id,
              name: team.pokemon6_nombre,
              image: team.pokemon6_imagen,
            },
          ],
        })),
      });
    }
  });
});

//UPDATE PKM Team
app.put("/team", (req, res) => {
  const { teamId, pokemonPosition, newPokemonId } = req.body;

  //Verify if the required fields are present
  if (!teamId || !pokemonPosition || !newPokemonId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Update query to set the new pokemon id in the specified position
  const query = `UPDATE equipo_pokemon SET pokemon${pokemonPosition}_id = ? WHERE id_equipo = ?`;

  connection.query(query, [newPokemonId, teamId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      // Verify if the query affected any rows
      if (results.affectedRows > 0) {
        res.json({ message: "Pokemon updated successfully" });
      } else {
        res.status(404).json({ message: "Team or Pokemon position not found" });
      }
    }
  });
});

app.post("/team", (req, res) => {
  const { username, team } = req.body;

  if (!username || !team) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Insert query to add a new team
  const query = `INSERT INTO equipo_pokemon (id_usuario, pokemon1_id, pokemon2_id, pokemon3_id, pokemon4_id, pokemon5_id, pokemon6_id) VALUES (
    (SELECT id FROM users WHERE nickname = ?),
    ?, ?, ?, ?, ?, ?
  )`;

  connection.query(
    query,
    [username, team[0], team[1], team[2], team[3], team[4], team[5]],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.json({ message: "Team created successfully" });
      }
    }
  );
});

app.delete("/team", (req, res) => {
  const { teamId } = req.body;

  if (!teamId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Delete query to remove a team by its id
  const query = `DELETE FROM equipo_pokemon WHERE id_equipo = ?`;

  connection.query(query, [teamId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      // Verify if the query affected any rows
      if (results.affectedRows > 0) {
        res.json({ message: "Team deleted successfully" });
      } else {
        res.status(404).json({ message: "Team not found" });
      }
    }
  });
});

//Pokemon BD Local ROUTES

app.get("/pokemon", (req, res) => {
  const id = req.query.id;
  let query = `SELECT * FROM pokemon`;

  if (id) {
    query = `SELECT * FROM pokemon WHERE id_pokemon = ?`;
  }

  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});
app.post("/pokemon", (req, res) => {
  const { id, name, image } = req.body;
  if (!id || !name || !image) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query = `INSERT INTO pokemon (id_pokemon, nombre, imagen) VALUES (?, ?, ?)`;

  connection.query(query, [id, name, image], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.json({ message: "Pokemon created successfully" });
    }
  });
});

app.put("/team/pokemon", (req, res) => {
  const { teamId, pokemonPosition } = req.body;
  if (!teamId || !pokemonPosition) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query = `UPDATE equipo_pokemon SET pokemon${pokemonPosition}_id = NULL WHERE id_equipo = ?`;
  connection.query(query, [teamId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.json({ message: "Pokemon deleted successfully" });
    }
  });
});

app.listen(port, () => {
  console.log(`API REST escuchando en el puerto ${port}`);
});
