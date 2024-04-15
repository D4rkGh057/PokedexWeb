import { useEffect, useState } from "react";
import { BerriesContext } from "./BerriesContext";

export const BerriesProvider = ({ children }) => {
  const [allBerries, setAllBerries] = useState([]);
  const [globalBerries, setGlobalBerries] = useState([]);
  const [offset, setOffset] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);

  const getAllBerries = async (limit = 30) => {
    const baseURL = "https://pokeapi.co/api/v2/";

    const res = await fetch(`${baseURL}berry?limit=${limit}&offset=${offset}`);
    const data = await res.json();

    const promises = data.results.map(async (berry) => {
      const res = await fetch(berry.url);
      const data = await res.json();
      return data;
    });
    const results = await Promise.all(promises);

    setAllBerries([...allBerries, ...results]);
  };

  const getGlobalBerries = async (limit = 64) => {
    const baseURL = "https://pokeapi.co/api/v2/";

    const res = await fetch(`${baseURL}berry?limit=${limit}`);
    const data = await res.json();

    const promises = data.results.map(async (berry) => {
      const res = await fetch(berry.url);
      const data = await res.json();
      return data;
    });
    const results = await Promise.all(promises);

    setGlobalBerries([...globalBerries, ...results]);
    setSearchLoading(false);
  };

  useEffect(() => {
    getAllBerries();    
  }
    , []);

  return (
    <BerriesContext.Provider
      value={{
        allBerries,
        globalBerries,
        getAllBerries,
        getGlobalBerries,
        searchLoading,
      }}
    >
      {children}
    </BerriesContext.Provider>
  );
};
