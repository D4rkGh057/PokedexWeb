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
          res.json({ message: "Incorrect password" });
        }
      } else {
        res.json({ message: "User not found" });
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

app.listen(port, () => {
  console.log(`API REST escuchando en el puerto ${port}`);
});
