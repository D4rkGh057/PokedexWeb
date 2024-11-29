import { useEffect, useState } from "react";
import { ItemsContext } from "./ItemsContext";

import PropTypes from "prop-types";

export const ItemsProvider = ({ children }) => {
  const [allItems, setAllItems] = useState([]);
  const [globalItems, setGlobalItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);

  const onClickLoadMore = () => {
    setOffset(offset + 30);
  };

  ItemsProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

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
    const newItems = results.filter(
      (resultItem) => !allItems.some((item) => item.id === resultItem.id)
    );
    setAllItems([...allItems, ...newItems]);
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

  const getItemsByID = async (id) => {
    const baseURL = "https://pokeapi.co/api/v2/";

    const res = await fetch(`${baseURL}item/${id}`);
    const data = await res.json();
    return data;
  };

  useEffect(() => {
    getAllItems();
  }, [offset]);

  const value = useMemo(() => ({
    allItems,
    globalItems,
    getAllItems,
    getGlobalItems,
    getItemsByID,
    searchLoading,
    onClickLoadMore,
  }), [allItems, globalItems, searchLoading, offset]);

  return (
    <ItemsContext.Provider value={value}>
      {children}
    </ItemsContext.Provider>
  );
};
