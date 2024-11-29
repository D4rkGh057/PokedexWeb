export const PokemonCard = () => {
  const typesColor = {
    steel: "background-color-steel",
    water: "background-color-water",
    bug: "background-color-bug",
    dragon: "background-color-dragon",
    electric: "background-color-electric",
    ghost: "background-color-ghost",
    fire: "background-color-fire",
    fairy: "background-color-fairy",
    ice: "background-color-ice",
    fighting: "background-color-fighting",
    normal: "background-color-normal",
    grass: "background-color-grass",
    psychic: "background-color-psychic",
    rock: "background-color-rock",
    dark: "background-color-dark",
    ground: "background-color-ground",
    poison: "background-color-poison",
    flying: "background-color-flying",
  };

  const getColorClass = (type) => typesColor[type] || "";

  return (
    <div className="pokemon-container">
      <p>#{pokemonData.id}</p>
      <h2>
        {pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}
      </h2>
      <img
        src={pokemonData.sprites.other["official-artwork"].front_default}
        alt={pokemonData.name}
      />
      <div className="pokemon-types">
        {pokemonData.types.map((type, index) => (
          <strong key={type.slot}>
            <span className={getColorClass(type.type.name)}>
              {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
            </span>
          </strong>
        ))}
      </div>
    </div>
  );
};
