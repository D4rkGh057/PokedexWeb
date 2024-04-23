import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./User.css";

export const UserPage = () => {
  const location = useLocation();
  const username = location.state;
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); 

  const cargarEquipos = () => {
    fetch(`http://localhost:5000/team?username=${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error en la petición");
        }
      })
      .then((data) => {
        // Guarda los datos en el estado
        setTeams(data.teams); // Asegúrate de que estás accediendo a la propiedad correcta del objeto de respuesta
        setIsLoading(false); // Actualiza el estado de carga después de recibir los datos
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(error.toString()); // Actualiza el estado de error en caso de que ocurra un error
        setIsLoading(false); // Actualiza el estado de carga en caso de que ocurra un error
      });
  };

  if (!username) {
    Swal.fire({
      title: "Error!",
      text: "You must be logged in to access this page",
      icon: "error",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      }
    });

    return null; // Return null or a loading spinner while waiting for user confirmation
  }

  useEffect(() => {
    cargarEquipos();
  }, []);

  return (
    <div>
      <h1 className="title">Welcome, {username}!</h1>
      <p>This is your user page.</p>

      {isLoading && <p>Loading teams...</p>}

      {error && <p className="error">{error}</p>}

      {teams.length > 0 && (
        teams.map((team, index) => (
          <div key={index}>
            <p>Team ID: {team.id_equipo}</p>
            <p>User ID: {team.id_usuario}</p>
            <h2>Team Pokemon</h2>
            <ul>
              {team.pokemons.map((pokemon) => (
                <li key={pokemon.nombre}>
                  <p>{pokemon.nombre}</p>
                  <img src={pokemon.imagen} alt={pokemon.nombre} />
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};
