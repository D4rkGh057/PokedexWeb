// Frontend - LoginPage component
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import Swal from "sweetalert2";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000", // Asegúrate de incluir el origen correcto
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful, you can redirect the user or perform other actions
        Swal.fire({
          title: data.message,
          text: "Welcome!",
          icon: "success"
        });
        navigate("/user", { state: username });
      } else {
        // Login failed, show an error message
        Swal.fire({
          title: "Error!",
          text: data.message,
          icon: "error"
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Internal server error");
    }
  };

  return (
    <div className="form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
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

        <button type="submit">Login</button>
        <p className="register">
          Don't have an account? <Link to={`/register`}>Register</Link>
        </p>
      </form>
    </div>
  );
};
