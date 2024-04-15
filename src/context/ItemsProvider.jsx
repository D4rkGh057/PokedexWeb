import { useState } from "react";
import { ItemsContext } from "./ItemsContext";

export const ItemsProvider = ({ children }) => {
  const [allItems, setAllItems] = useState([]);
  const [globalItems, setGlobalItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);

  const getAllItems = async (limit = 30) => {
    const baseURL = "https://pokeapi.co/api/v2/";

    const res = await fetch(`${baseURL}item?limit=${limit}&offset=${offset}`);
    const data = await res.json();

    const promises = data.results.map(async (item) => {
      const res = await fetch(item.url);
      const data = await res.json();
      return data;
    });
    const results = await Promise.all(promises);

    setAllItems([...allItems, ...results]);
  };

  const getGlobalItems = async (limit = 64) => {
    const baseURL = "https://pokeapi.co/api/v2/";

    const res = await fetch(`${baseURL}item?limit=${limit}`);
    const data = await res.json();

    const promises = data.results.map(async (item) => {
      const res = await fetch(item.url);
      const data = await res.json();
      return data;
    });
    const results = await Promise.all(promises);

    setGlobalItems([...globalItems, ...results]);
    setSearchLoading(false);
  };

  return (
    <ItemsContext.Provider
      value={{
        allItems,
        globalItems,
        getAllItems,
        getGlobalItems,
        searchLoading,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
};
