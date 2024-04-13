import React, { useContext } from "react";
import { PokemonContext } from "../context/PokemonContext";
import { CardPokemon } from "./CardPokemon";
import { Loader } from "./Loader";
import "./pokemons.css";

export const PokemonList = () => {
  const { allPokemons, loading, filteredPokemons } = useContext(PokemonContext);

  return (
    <>
      {loading ? (
        <div
          style={{ display: "flex", justifyContent: "center", margin: "28%" }}
        >
        <Loader />
        </div>
      ) : (
        <div className="card-list-pokemon container">
          {filteredPokemons.length ? (
            <>
              {filteredPokemons.map((pokemon) => (
                <CardPokemon pokemon={pokemon} key={pokemon.id} />
              ))}
            </>
          ) : (
            <>
              {allPokemons.map((pokemon) => (
                <CardPokemon pokemon={pokemon} key={pokemon.id} />
              ))}
            </>
          )}
        </div>
      )}
    </>
  );
};
