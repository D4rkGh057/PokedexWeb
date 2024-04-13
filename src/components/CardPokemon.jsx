import React from "react";
import { Link } from "react-router-dom";

export const CardPokemon = ({ pokemon }) => {
  return (
    <Link to={`/pokemon/${pokemon.id}`} className="card-pokemon">
      <div className="card-img">
        <img
          src={
            pokemon.sprites.other["official-artwork"].front_default
              ? pokemon.sprites.other["official-artwork"].front_default
              : pokemon.sprites.other["home"]
              ? pokemon.sprites.other["home"].front_default
              : pokemon.sprites.front_default
          }
          alt={`Pokemon ${pokemon.name}`}
        />
      </div>
      <div className="card-info">
        <span className="pokemon-id">N° {pokemon.id}</span>
        <h3>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
        <div className="card-types">
          {pokemon.types.map((type) => (
            <span key={type.type.name} className={type.type.name}>
              {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};
