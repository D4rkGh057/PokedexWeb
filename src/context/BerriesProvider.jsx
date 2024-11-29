import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BerriesContext } from "./BerriesContext";

export const BerriesProvider = ({ children }) => {
  const [allBerries, setAllBerries] = useState([]);
  const [globalBerries, setGlobalBerries] = useState([]);
  const [offset, setOffset] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);

  const onClickLoadMore = () => {
    setOffset(offset + 35);
  };
  
  BerriesProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };


  const getAllBerries = async (limit = 35) => {
    const baseURL = "https://pokeapi.co/api/v2/";

    const res = await fetch(`${baseURL}berry?limit=${limit}&offset=${offset}`);
    const data = await res.json();

    const promises = data.results.map(async (berry) => {
      const res = await fetch(berry.url);
      const data = await res.json();
      return data;
    });
    const results = await Promise.all(promises);
    const newBerries = results.filter(
      (resultBerry) => !allBerries.some((berry) => berry.id === resultBerry.id)
    );
    setAllBerries([...allBerries, ...newBerries]);
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

  const getBerriesByID = async (id) => {
    const baseURL = "https://pokeapi.co/api/v2/";

    const res = await fetch(`${baseURL}berry/${id}`);
    const data = await res.json();
    return data;
  };

  useEffect(() => {
    getAllBerries();
  }, [offset]);

  const contextValue = useMemo(() => ({
    allBerries,
    globalBerries,
    getAllBerries,
    getGlobalBerries,
    getBerriesByID,
    searchLoading,
    onClickLoadMore,
  }), [allBerries, globalBerries, searchLoading, offset]);

  return (
    <BerriesContext.Provider value={contextValue}>
      {children}
    </BerriesContext.Provider>
  );
};
