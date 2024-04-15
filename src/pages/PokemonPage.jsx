import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "../components";
import { PokemonContext } from "../context/PokemonContext";

export const PokemonPage = () => {
  const { getPokemonByID, getPKMLocationByID } = useContext(PokemonContext);

  const [loading, setLoading] = useState(true);
  const [pokemon, setPokemon] = useState({});
  const [location, setLocation] = useState([]);

  const { id } = useParams();

  const fetchPokemon = async (id) => {
    const data = await getPokemonByID(id);
    setPokemon(data);
    setLoading(false);
  };

  const fetchLocation = async (id) => {
    const data = await getPKMLocationByID(id);
    setLocation(data);
  };

  function formatString(str) {
    return str
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  useEffect(() => {
    fetchPokemon(id);
    fetchLocation(id);
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", margin: "28%" }}>
        <Loader />
      </div>
    );
  }

  return (
    <main className="container main-pokemon">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="header-main-pokemon">
            <span className="number-pokemon">#{pokemon.id}</span>
            <div className="container-img-pokemon">
              <img
                src={pokemon.sprites.other["showdown"].front_default}
                alt={`Pokemon ${pokemon?.name}`}
              />
            </div>

            <div className="container-info-pokemon">
              <h1>{formatString(pokemon.name)}</h1>
              <div className="card-types info-pokemon-type">
                {pokemon.types.map((type) => (
                  <span key={type.type.name} className={`${type.type.name}`}>
                    {formatString(type.type.name)}
                  </span>
                ))}
              </div>
              <div className="info-pokemon">
                <div className="group-info">
                  <p>Height</p>
                  <span>{pokemon.height / 10} M</span>
                </div>
                <div className="group-info">
                  <p>Weight</p>
                  <span>{pokemon.weight / 10} KG</span>
                </div>
              </div>
            </div>
          </div>
          <div className="container-habilities">
            <h1>Habilities</h1>
            <div className="card-habilities">
              {pokemon.abilities.map((ability) => (
                <span key={ability.ability.name} className="ability">
                  {formatString(ability.ability.name)}
                </span>
              ))}
            </div>
          </div>
          <div className="container-stats">
            <h1>Stats</h1>
            <div className="stats">
              <div className="stat-group">
                <span>Hp</span>
                <div
                  className={`progress-bar ${pokemon.stats[0].stat.name}`}
                  style={{
                    width: `${pokemon.stats[0].base_stat / 8}rem`,
                    marginLeft: "7.4rem",
                  }}
                ></div>
                <span className="counter-stat">
                  {pokemon.stats[0].base_stat}
                </span>
              </div>
              <div className="stat-group">
                <span>Attack</span>
                <div
                  className={`progress-bar ${pokemon.stats[1].stat.name}`}
                  style={{
                    width: `${pokemon.stats[1].base_stat / 8}rem`,
                    marginLeft: "5.4rem",
                  }}
                ></div>
                <span className="counter-stat">
                  {pokemon.stats[1].base_stat}
                </span>
              </div>
              <div className="stat-group">
                <span>Defense</span>
                <div
                  className={`progress-bar ${pokemon.stats[2].stat.name}`}
                  style={{
                    width: `${pokemon.stats[2].base_stat / 8}rem`,
                    marginLeft: "4.4rem",
                  }}
                ></div>
                <span className="counter-stat">
                  {pokemon.stats[2].base_stat}
                </span>
              </div>
              <div className="stat-group">
                <span>Special Attack</span>
                <div
                  className={`progress-bar ${pokemon.stats[3].stat.name}`}
                  style={{
                    width: `${pokemon.stats[3].base_stat / 8}rem`,
                    marginLeft: "0.9rem",
                  }}
                ></div>
                <span className="counter-stat">
                  {pokemon.stats[3].base_stat}
                </span>
              </div>
              <div className="stat-group">
                <span>Special Defense</span>
                <div
                  className={`progress-bar ${pokemon.stats[4].stat.name}`}
                  style={{ width: `${pokemon.stats[4].base_stat / 8}rem` }}
                ></div>
                <span className="counter-stat">
                  {pokemon.stats[4].base_stat}
                </span>
              </div>
              <div className="stat-group">
                <span>Speed</span>
                <div
                  className={`progress-bar ${pokemon.stats[5].stat.name}`}
                  style={{
                    width: `${pokemon.stats[5].base_stat / 8}rem`,
                    marginLeft: "5.5rem",
                  }}
                ></div>
                <span className="counter-stat">
                  {pokemon.stats[5].base_stat}
                </span>
              </div>
              <span>
                Total:
                {" " +
                  pokemon.stats.reduce((acc, stat) => acc + stat.base_stat, 0)}
              </span>
            </div>
          </div>
          <div className="container-location">
            <h1>Locations</h1>
            <table className="location">
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Game Version</th>
                </tr>
              </thead>
              <tbody>
                {location.map((location) => (
                  <tr
                    key={location.location_area.name}
                    className="location-group"
                  >
                    <td>{formatString(location.location_area.name)}</td>
                    <td>
                      {formatString(location.version_details[0].version.name)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
};
