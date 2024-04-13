// Frontend - LoginPage component
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import { useNavigate } from "react-router-dom";

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
        alert(data.message);
        navigate("/user", { state: username });
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

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};
