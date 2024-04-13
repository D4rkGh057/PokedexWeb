import { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { PokemonContext } from "../context/PokemonContext";
import { SearchLoader } from "./SearchLoader";

export const Navigation = () => {
  const {
    onInputChange,
    valueSearch,
    onResetForm,
    getGlobalPokemons,
    loading,
  } = useContext(PokemonContext);

  const navigate = useNavigate();

  const onSearchSubmit = async (e) => {
    e.preventDefault();
    if (valueSearch.trim() === "") return;
    navigate("/search", {
      state: valueSearch,
    });
    await getGlobalPokemons();

    onResetForm();
  };
  return (
    <div>
      <header>
        <Link to="/" className="pokedex">
          <img
            src="https://archives.bulbagarden.net/media/upload/4/4b/Pok%C3%A9dex_logo.png"
            alt="Logo Pokedex"
          />
        </Link>
        <div className="form-group">
          <form onSubmit={onSearchSubmit}>
            <input
              type="search"
              name="valueSearch"
              id=""
              value={valueSearch}
              onChange={onInputChange}
              placeholder="Search by PKM Name"
            />
            <button className="btn-search">Buscar</button>
          </form>
        </div>
        <Link to={`/login`} className="login">
          Login
        </Link>
      </header>
      <Outlet />
    </div>
  );
};
