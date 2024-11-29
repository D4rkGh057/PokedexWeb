import { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { PokemonContext } from "../context/PokemonContext";
import { Sidebar } from "./Sidebar";
import logo from "../assets/pkdx_logo.png"

export const Navigation = () => {
  const username = localStorage.getItem("username");
  const {
    onInputChange,
    valueSearch,
    onResetForm,
    getGlobalPokemons,
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
        <Sidebar />
        <Link to="/" className="pokedex">
          <img
            src={logo}
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
            <button className="btn-search">Search</button>
          </form>
        </div>
        {!username && <Link to="/login" className="login">Login</Link>}
      </header>
      <Outlet />
    </div>
  );
};
