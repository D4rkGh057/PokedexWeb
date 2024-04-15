import React, { useState } from "react";
import "./Sidebar.css";
import BurgerMenuIcon from "../assets/burger-menu.svg";
import { Link } from "react-router-dom";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button className="button" onClick={toggleSidebar}>
        <img className="icon" src={BurgerMenuIcon} alt="Toggle Sidebar" />
      </button>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul>
            <Link to="/" onClick={toggleSidebar}><li>Pokemon</li></Link>
            <Link to="/berries" onClick={toggleSidebar}><li>Berries</li></Link>
            <Link to="/items" onClick={toggleSidebar}><li>Items</li></Link>
        </ul>
      </div>
    </div>
  );
};
