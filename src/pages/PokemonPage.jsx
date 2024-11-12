import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "../components";
import { PokemonContext } from "../context/PokemonContext";
import "./PokemonPage.css";

export const PokemonPage = () => {
  const {
    getPokemonByID,
    getPKMLocationByID,
    getEvoChainByID,
    getSpeciesByID,
  } = useContext(PokemonContext);

  const [loading, setLoading] = useState(true);
  const [pokemon, setPokemon] = useState({});
  const [location, setLocation] = useState([]);
  const [evoChain, setEvoChain] = useState([]);
  const [species, setSpecies] = useState([]);

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

  const fetchEvoChain = async (id) => {
    const data = await getEvoChainByID(id);
    setEvoChain(data);
  };

  const fetchSpecies = async (id) => {
    const data = await getSpeciesByID(id);
    setSpecies(data);
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
    if (id < 3000) {
      fetchEvoChain(id);
      fetchSpecies(id);
    }
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
          <h1 className="titles">{formatString(pokemon.name)}</h1>
          <div className="header-main-pokemon">
            <span className="number-pokemon">#{pokemon.id}</span>
            <div className="container-info-pokemon">
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
                  <span className="titles">{pokemon.height / 10} M</span>
                </div>
                <div className="group-info">
                  <p>Weight</p>
                  <span className="titles">{pokemon.weight / 10} KG</span>
                </div>
              </div>
            </div>
            <div className="container-img-pokemon">
              <img
                src={pokemon.sprites.other["showdown"].front_default}
                alt={`Pokemon ${pokemon?.name}`}
              />
            </div>
          </div>
          <div className="container-habilities">
            <h1 className="titles">Habilities</h1>
            <div className="card-habilities">
              {pokemon.abilities.map((ability) => (
                <span key={ability.ability.name} className="ability">
                  {formatString(ability.ability.name)}
                </span>
              ))}
            </div>
          </div>
          <div className="separador">
            <div className="container-stats">
              <h1 className="titles">Stats</h1>
              <div className="stats">
                {pokemon.stats.map((stat, index) => (
                  <div className="stat-group" key={index}>
                    <span>{formatString(stat.stat.name)}</span>
                    <div
                      className="progress-bar"
                      style={{
                        width: `${stat.base_stat / 11}rem`,
                      }}
                    ></div>
                    <span className="counter-stat">{stat.base_stat}</span>
                  </div>
                ))}
                <span>
                  Total:
                  {" " +
                    pokemon.stats.reduce(
                      (acc, stat) => acc + stat.base_stat,
                      0
                    )}
                </span>
              </div>
            </div>
            <div className="container-location">
              <h1 className="titles">Locations</h1>
              <div className="table-wrapper">
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
                          {formatString(
                            location.version_details[0].version.name
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <h1 className="titles">Evo Chain</h1>
          {evoChain.chain ? (
            <div className="container-evo">
              {evoChain.chain &&
                evoChain.chain.evolves_to.map((evolution) => (
                  <React.Fragment key={evolution.species.name}>
                    {evolution.species.name !== pokemon.name ? (
                      <div className="evo-pokemon">
                        <h2>Step 1</h2>
                        <h3>{formatString(evolution.species.name)}</h3>
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                            evolution.species.url.split("/")[6]
                          }.png`}
                          alt={formatString(evolution.species.name)}
                        />
                      </div>
                    ) : (
                      species.evolves_from_species && (
                        <div
                          key={species.evolves_from_species.name}
                          className="evo-pokemon"
                        >
                          <h2>Previous</h2>
                          <h3>
                            {formatString(species.evolves_from_species.name)}
                          </h3>
                          <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                              species.evolves_from_species.url.split("/")[6]
                            }.png`}
                            alt={formatString(
                              species.evolves_from_species.name
                            )}
                          />
                        </div>
                      )
                    )}
                    {evolution.evolves_to[0].species.name !== pokemon.name ? (
                      <div
                        key={`${evolution.species.name}-step2`}
                        className="evo-pokemon"
                      >
                        <h2>Next</h2>
                        <h3>
                          {evolution.evolves_to.map((evoTo) => (
                            <div key={evoTo.species.name}>
                              {formatString(evoTo.species.name)}
                            </div>
                          ))}
                        </h3>
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                            evolution.evolves_to[0].species.url.split("/")[6]
                          }.png`}
                          alt={formatString(
                            evolution.evolves_to[0].species.name
                          )}
                        />
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </React.Fragment>
                ))}
            </div>
          ) : (
            <div></div>
          )}
        </>
      )}
    </main>
  );
};
