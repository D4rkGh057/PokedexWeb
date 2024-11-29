import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export const CardPokemon = ({ pokemon }) => {
  function formatString(str) {
    return str
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Prop validations
  CardPokemon.propTypes = {
    pokemon: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      sprites: PropTypes.shape({
        front_default: PropTypes.string,
        other: PropTypes.shape({
          "official-artwork": PropTypes.shape({
            front_default: PropTypes.string,
          }),
          home: PropTypes.shape({
            front_default: PropTypes.string,
          }),
        }),
      }),
      types: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.shape({
            name: PropTypes.string.isRequired,
          }).isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired,
  };

  return (
    <Link to={`/pokemon/${pokemon.id}`} className="card-pokemon">
      <div className="card-img">
        <img
          src={
            pokemon.sprites.other["official-artwork"]?.front_default ||
              pokemon.sprites.other["home"]?.front_default ||
              pokemon.sprites.front_default
          }
          alt={`Pokemon ${pokemon.name}`}
        />
      </div>
      <div className="card-info">
        <span className="pokemon-id">N° {pokemon.id}</span>
        <h3>{formatString(pokemon.name)}</h3>
        <div className="card-types">
          {pokemon.types.map((type) => (
            <span key={type.type.name} className={type.type.name}>
              {formatString(type.type.name)}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default CardPokemon; // Optional export for default usage