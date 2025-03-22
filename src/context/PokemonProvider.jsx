import { useEffect,useMemo, useState } from "react";
import { useForm } from "../hook/useForm";
import { PokemonContext } from "./PokemonContext";

export const PokemonProvider = ({ children }) => {
  const [allPokemons, setAllPokemons] = useState([]);
  const [globalPokemons, setGlobalPokemons] = useState([]);
  const [offset, setOffset] = useState(0);

  // Utilizar CustomHook - useForm
  const { valueSearch, onInputChange, onResetForm } = useForm({
    valueSearch: "",
  });

  // Estados para la aplicación simples
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // lLamar 50 pokemones a la API
  const getAllPokemons = async (limit = 40) => {
    const baseURL = "https://pokeapi.co/api/v2/";

    const res = await fetch(
      `${baseURL}pokemon?limit=${limit}&offset=${offset}`
    );
    const data = await res.json();

    const promises = data.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      const data = await res.json();
      return data;
    });
    const results = await Promise.all(promises);

    setAllPokemons([...allPokemons, ...results]);
    setLoading(false);
  };

  // Llamar todos los pokemones
  const getGlobalPokemons = async () => {
    setSearchLoading(true);
    const baseURL = "https://pokeapi.co/api/v2/";
    const limit = 1000;
    const maxPokemons = 15000;

    for (let offset = 0; offset < maxPokemons; offset += limit) {
      const res = await fetch(
        `${baseURL}pokemon?limit=${limit}&offset=${offset}`
      );
      const data = await res.json();

      const promises = data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        const data = await res.json();
        return data;
      });
      const results = await Promise.all(promises);

      setGlobalPokemons((prevPokemons) => {
        const newPokemons = results.filter(
          (result) =>
            !prevPokemons.some((pokemon) => pokemon.name === result.name)
        );
        return [...prevPokemons, ...newPokemons];
      });
    }

    setSearchLoading(false);
  };

  // Llamar a un pokemon por ID
  const getPokemonByID = async (id) => {
    const baseURL = "https://pokeapi.co/api/v2/";

    const res = await fetch(`${baseURL}pokemon/${id}`);
    const data = await res.json();
    return data;
  };

  const getPKMLocationByID = async (id) => {
    const baseURL = "https://pokeapi.co/api/v2/";

    const res = await fetch(`${baseURL}pokemon/${id}/encounters`);
    const data = await res.json();
    return data;
  };

  const getSpeciesByID = async (id) => {
    const baseURL = "https://pokeapi.co/api/v2/";
    const res = await fetch(`${baseURL}pokemon-species/${id}`);
    const data = await res.json();
    return data;
  };

  const getEvoChainByID = async (id) => {
    try {
      const specie = await getSpeciesByID(id);
      const evoChainURL = specie.evolution_chain.url;

      const res = await fetch(evoChainURL);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching evolution chain:", error);
      return null;
    }
  };

  useEffect(() => {
    getAllPokemons();
  }, [offset]);

  // BTN Load More
  const onClickLoadMore = () => {
    setOffset(offset + 40);
  };

  // Filter Function + State
  const [typeSelected, setTypeSelected] = useState({
    grass: false,
    normal: false,
    fighting: false,
    flying: false,
    poison: false,
    ground: false,
    rock: false,
    bug: false,
    ghost: false,
    steel: false,
    fire: false,
    water: false,
    electric: false,
    psychic: false,
    ice: false,
    dragon: false,
    dark: false,
    fairy: false,
    unknow: false,
    shadow: false,
  });

  const [filteredPokemons, setfilteredPokemons] = useState([]);

  const handleCheckbox = (e) => {
    setTypeSelected({
      ...typeSelected,
      [e.target.name]: e.target.checked,
    });

    if (e.target.checked) {
      const filteredResults = globalPokemons.filter((pokemon) =>
        pokemon.types.map((type) => type.type.name).includes(e.target.name)
      );
      setfilteredPokemons([...filteredPokemons, ...filteredResults]);
    } else {
      const filteredResults = filteredPokemons.filter(
        (pokemon) =>
          !pokemon.types.map((type) => type.type.name).includes(e.target.name)
      );
      setfilteredPokemons([...filteredResults]);
    }
  };

  const providerValue = useMemo(() => ({
    valueSearch,
    onInputChange,
    onResetForm,
    allPokemons,
    globalPokemons,
    getPokemonByID,
    getPKMLocationByID,
    getEvoChainByID,
    getSpeciesByID,
    onClickLoadMore,
    getGlobalPokemons,
    // Loader
    loading,
    setLoading,
    searchLoading,
    // Btn Filter
    active,
    setActive,
    // Filter Container Checkbox
    handleCheckbox,
    filteredPokemons,
  }), [
    valueSearch,
    onInputChange,
    onResetForm,
    allPokemons,
    globalPokemons,
    getPokemonByID,
    getPKMLocationByID,
    getEvoChainByID,
    getSpeciesByID,
    onClickLoadMore,
    getGlobalPokemons,
    loading,
    setLoading,
    searchLoading,
    active,
    setActive,
    handleCheckbox,
    filteredPokemons,
  ]);

  return (
    <PokemonContext.Provider value={providerValue}>
      {children}
    </PokemonContext.Provider>
  );
};