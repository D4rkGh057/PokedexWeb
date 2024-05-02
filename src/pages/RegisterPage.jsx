// Frontend - RegisterPage component
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

export const RegisterPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [team, setTeam] = useState([]);

  const createPokemonTeam = async (username, team) => {
    try {
      const response = await fetch("http://localhost:5000/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
        body: JSON.stringify({ username, team }),
      });
  
      if (response.ok) {
        console.log("Team created successfully");
      } else {
        console.error("Failed to create team");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    const confirmPassword = event.target['password-confirm'].value;

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000", // Asegúrate de incluir el origen correcto
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registro exitoso, puedes redirigir al usuario u realizar otras acciones
        alert(data.message);
        createPokemonTeam(username, team);
        window.location.href = "/login"; // Redirige al usuario a la página de inicio de sesión después del registro exitoso
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Internal server error");
    }
  };

  return (
    <div className="form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <label className="label-form" htmlFor="username">
          Username:
        </label>
        <input
          className="input-form"
          type="text"
          id="username"
          name="username"
        />

        <label className="label-form" htmlFor="password">
          Password:
        </label>
        <input
          className="input-form"
          type="password"
          id="password"
          name="password"
        />
        <label className="label-form" htmlFor="password-confirm">
          Confirm Password:
        </label>
        <input
          className="input-form"
          type="password"
          id="password-confirm"
          name="password-confirm"
        />

        <button type="submit">Sign Up</button>
        <p className="register">
          You have an account? <Link to={`/login`}>Login</Link>
        </p>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};
