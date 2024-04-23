import React, { useContext, useEffect } from "react";
import { ItemsContext } from "../context/ItemsContext";
import "./Items.css";

export const ItemsPage = () => {
  const { allItems, getAllItems, searchLoading,onClickLoadMore } = useContext(ItemsContext);

  function formatString(str) {
    return str
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function getEnglishFlavorText(item) {
    const englishEntry = item.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    );
    return englishEntry ? englishEntry.text : "";
  }

  return (
    <div className="items-container">
      <h1 className="section-title">ItemsPage</h1>
      {searchLoading ? (
        <p>Loading...</p>
      ) : (
        allItems.map((item) => (
          <div key={item.id} className="item-card">
            <h2>{formatString(item.name)}</h2>
            <img src={item.sprites.default} alt={item.name} />
            <p>{getEnglishFlavorText(item)}</p>
          </div>
        ))
      )}
      <div className="container-btn-load-more container">
        <button className="btn-load-more" onClick={onClickLoadMore}>
          Cargar más
        </button>
      </div>
    </div>
  );
};
