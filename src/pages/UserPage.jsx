import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./User.css";
import { Loader } from "../components";
import { TbPencilCog } from "react-icons/tb";
import { PokemonContext } from "../context/PokemonContext";
import imgholder from "../assets/pokeball.svg";

export const UserPage = () => {
  const { allPokemons } = useContext(PokemonContext);
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const [team, setTeam] = useState([]);
  const [teams, setTeams] = useState([]);
  const [historyTeams, setHistoryTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editablePokemon, setEditablePokemon] = useState({}); // Add this line to initialize the state with an empty object
  const [visible, setVisible] = useState(false); // Add this line to initialize the state with a boolean value [false
  const [editIndex, setEditIndex] = useState(0); // Add this line to initialize the state with a null value [null
  const [viewhistorial, setViewHistorial] = useState(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Update search term on input change
  };

  const handleEditPokemon = (pokemon, index) => {
    setEditablePokemon(pokemon);
    setEditIndex(index + 1);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission

    setVisible(true);
    // Implement your search logic here using searchTerm
    filterPokemon(searchTerm); // Assuming filterPokemon function takes searchTerm as input
  };

  function formatString(str) {
    return str
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

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
        cargarEquipo();
      } else {
        console.error("Failed to create team");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filterPokemon = () => {
    const filteredPokemon = allPokemons.find((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredPokemon) {
      setEditablePokemon({
        id: filteredPokemon.id,
        name: filteredPokemon.name,
        image: filteredPokemon.sprites.other["official-artwork"].front_default,
      });
    } else {
      setEditablePokemon({}); // Reset editablePokemon if no match found
    }
  };

  const cargarEquipo = () => {
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
          throw new Error("Error on request");
        }
      })
      .then((data) => {
        // Guarda los datos en el estado
        setTeams(data.teams); // Asegúrate de que estás accediendo a la propiedad correcta del objeto de respuesta
        setIsLoading(false); // Actualiza el estado de carga después de recibir los datos
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false); // Actualiza el estado de carga en caso de que ocurra un error
      });
  };

  const cargarEquipos = () => {
    fetch(`http://localhost:5000/team/all?username=${username}`, {
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
          throw new Error("Error on request");
        }
      })
      .then((data) => {
        // Guarda los datos en el estado
        setHistoryTeams(data.teams); // Asegúrate de que estás accediendo a la propiedad correcta del objeto de respuesta
        setIsLoading(false); // Actualiza el estado de carga después de recibir los datos
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false); // Actualiza el estado de carga en caso de que ocurra un error
      });
  };

  const getPokemon = async (id) => {
    // Construir la URL para la solicitud GET
    const url = `http://localhost:5000/pokemon?id=${id}`;

    try {
      // Realizar la solicitud GET y esperar la respuesta
      const response = await fetch(url);

      // Verificar si la solicitud fue exitosa
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Parsear la respuesta como JSON
      const data = await response.json();
      // Devolver los resultados
      return data;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const handleAddPokemon = async () => {
    try {
      // Check if the Pokémon already exists in the database
      const existingPokemon = await getPokemon(editablePokemon.id);

      // If the Pokémon already exists, log a message and exit the function
      if (existingPokemon.length > 0) {
        return;
      }

      // If the Pokémon doesn't exist, perform the insertion
      const response = await fetch(`http://localhost:5000/pokemon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
        body: JSON.stringify(editablePokemon), // Use editablePokemon for the new Pokémon data
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdatePokemonOnTeam = async (
    teamId,
    pokemonPosition,
    newPokemonId
  ) => {
    try {
      await handleAddPokemon();
      const response = await fetch(`http://localhost:5000/team`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
        body: JSON.stringify({ teamId, pokemonPosition, newPokemonId }),
      });

      if (response.ok) {
        cargarEquipo();
        setVisible(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeletePokemonFromTeam = async (teamId, pokemonPosition) => {
    try {
      const response = await fetch(`http://localhost:5000/team/pokemon`, {
        method: "PUT", // Cambiar el método a PUT
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
        body: JSON.stringify({ teamId, pokemonPosition }), // Utilizar el cuerpo para enviar los datos
      });

      if (response.ok) {
        cargarEquipo();
        setVisible(false);
      } else {
        console.error("Failed to delete Pokemon from team");
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
    cargarEquipo();
    cargarEquipos();
  }, []);

  return (
    <div className="user-container">
      <div className="user-profile">
        <h1 className="title" style={{ textAlign: "center" }}>
          Welcome to your Pokémon Trainer page,<br></br> {username}!
        </h1>
        <p>
          Here you can manage your Pokémon teams, add new Pokémon to your teams,
          and remove Pokémon from your teams.
        </p>
        <b>Instructions</b>
        <ol>
          <li>
            Click the 'Edit' button and select an empty space to add a Pokémon
            to your team.
          </li>
          <li>Use the search bar to find a Pokémon by name.</li>
          <li>
            Click the 'Add' button to add the selected Pokémon to your team.
          </li>
        </ol>

        <b>Delete Instructions</b>
        <ol>
          <li>
            Click the 'Edit' button and select a Pokémon to remove from your
            team.
          </li>
          <li>Click the 'Remove' button to remove the selected Pokémon.</li>
        </ol>

        <div className="team-options">
          <h3>Team Options</h3>
          <ul>
            <li>To add a new team click on add team</li>
            <li>
              To see your previous teams, click on 'History Teams,' and to hide
              it, click again.
            </li>
          </ul>
          <button onClick={() => createPokemonTeam(username, team)}>
            Add Team
          </button>
          <button onClick={() => setViewHistorial(!viewhistorial)}>
            History Teams
          </button>
        </div>
        {viewhistorial && (
          <>
            <h3>Previous Teams</h3>
            {historyTeams.map((team, index) => (
              <div key={index}>
                <h2>Team Pokemon {index + 1}</h2>
                <div className="team-historial">
                  {team.pokemons.map((pokemon, index) => (
                    <div className="history-pkm">
                      <span key={index}>
                        <strong>
                          {pokemon.name
                            ? formatString(pokemon.name)
                            : "No Pokemon"}
                        </strong>
                      </span>
                      <img
                        src={pokemon.image ? pokemon.image : imgholder}
                        alt={pokemon.name}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
        {visible && (
          <>
            <div className="edit-pokemon">
              <h3>Pokemon</h3>
              <form
                className="search-form"
                onSubmit={(event) => handleSearchSubmit(event)}
              >
                <input
                  type="text"
                  placeholder="Search Pokemon..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <button type="submit"> Search</button>
              </form>
              <span>
                {editablePokemon.name ? editablePokemon.name : "Pokemon Name"}
              </span>
              <img
                src={editablePokemon.image ? editablePokemon.image : imgholder}
                alt="Pokemon"
              />
            </div>
          </>
        )}
      </div>

      {isLoading && (
        <div
          style={{ display: "flex", justifyContent: "center", margin: "28%" }}
        >
          <Loader />
        </div>
      )}

      {teams.length > 0 && (
        <div className="pokemon-team-gallery">
          {teams.map((team, index) => (
            <div className="pokemon-team-container" key={index}>
              <div className="head-pokemon-team">
                <h2 className="titles">Team Pokemon</h2>
              </div>
              <ul className="pokemon-team">
                {team.pokemons.map((pokemon, index) => (
                  <li className="pokemon" key={index}>
                    <p style={{ fontWeight: 600 }}>
                      {pokemon.name ? formatString(pokemon.name) : "No Pokemon"}
                    </p>
                    <img
                      src={pokemon.image ? pokemon.image : imgholder}
                      alt={pokemon.name}
                    />
                    {visible && (
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEditPokemon(pokemon, index)}
                      >
                        <TbPencilCog />
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <div className="team-options" key={index}>
                <p style={{ textAlign: "center" }}> Options</p>
                <button
                  style={{ backgroundColor: "green", fontWeight: 600 }}
                  onClick={() =>
                    handleUpdatePokemonOnTeam(
                      team.id_equipo,
                      editIndex,
                      editablePokemon.id
                    )
                  }
                >
                  Add
                </button>
                <button
                  style={{ backgroundColor: "blue", fontWeight: 600 }}
                  onClick={() => setVisible(!visible)}
                >
                  Edit
                </button>
                <button
                  style={{ fontWeight: 600 }}
                  onClick={() =>
                    handleDeletePokemonFromTeam(team.id_equipo, editIndex)
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
