import React, { useState } from "react";
import "./Sidebar.css";
import BurgerMenuIcon from "../assets/burger-menu.svg";
import { Link } from "react-router-dom";

export const Sidebar = () => {
  const username = localStorage.getItem("username");
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSession = () => {
    localStorage.removeItem("username");
    window.location.reload();
  };

  return (
    <div>
      <button className="button" onClick={toggleSidebar}>
        <img className="icon" src={BurgerMenuIcon} alt="Toggle Sidebar" />
      </button>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul>
          <Link to="/" onClick={toggleSidebar}>
            <li>Pokemon</li>
          </Link>
          <Link to="/berries" onClick={toggleSidebar}>
            <li>Berries</li>
          </Link>
          <Link to="/items" onClick={toggleSidebar}>
            <li>Items</li>
          </Link>
          {username && (
            <Link to="/user" onClick={toggleSidebar}>
              <li>User</li>
            </Link>
          )}
        </ul>
        <div className="sidebar-inner"></div>
        {username && (
          <div style={{ position: "absolute", bottom: 70 ,cursor:"pointer"}}>
            <a onClick={closeSession}>Log Out</a>
          </div>
        )}
      </div>
    </div>
  );
};
