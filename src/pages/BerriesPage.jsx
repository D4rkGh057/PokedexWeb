import { useContext, useEffect } from "react";
import { BerriesContext } from "../context/BerriesContext";
import "./Berries.css";

export const BerriesPage = () => {
  const { allBerries, searchLoading, onClickLoadMore } =
    useContext(BerriesContext);

  function formatString(str) {
    return str
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <>
      <div className="berries-container">
        <h1 className="section-title">BerriesPage</h1>
        {searchLoading ? (
          <p>Loading...</p>
        ) : (
          allBerries.map((berry) => (
            <div key={berry.id} className="berrie-card">
              <h2>{formatString(berry.name)}</h2>
              <img
                src={`https://raw.githubusercontent.com/D4rkGh057/sprites_pokedex/main/Bayas/${berry.name}.png`}
                alt={berry.name}
              />
              <p>{berry.effect_entries && berry.effect_entries[0]?.effect}</p>
            </div>
          ))
        )}
      </div>
      <div className="container-btn-load-more container">
        <button className="btn-load-more" onClick={onClickLoadMore}>
          Cargar más
        </button>
      </div>
    </>
  );
};
