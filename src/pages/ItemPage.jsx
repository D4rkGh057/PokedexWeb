import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ItemsContext } from "../context/ItemsContext";
import { Loader } from "../components";
import "./Items.css";

export const ItemPage = () => {
  const { id } = useParams();
  const { getItemsByID } = useContext(ItemsContext);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState({});

  const fetchItem = async (id) => {
    const data = await getItemsByID(id);
    setItem(data);
    setLoading(false);
  };

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

  useEffect(() => {
    fetchItem(id);
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", margin: "28%" }}>
        <Loader />
      </div>
    );
  }
  return (
    <div className="main-item">
      <h1 className="titles">{formatString(item.name)}</h1>
      <div className="header-main-item">
        <img src={item.sprites.default} alt={item.name} />
        <div className="group-info">
          <p>Category:</p>
          <span
            style={{
              backgroundColor: "#181818",
              color: "#f8f8f8",
              padding: "10px",
              borderRadius: "15px",
            }}
          >
            {formatString(item.category.name)}
          </span>
        </div>
      </div>
      <div className="body-main-item">
        <div className="group-item-info">
          <p>Cost:</p>
          <span> {item.cost}$</span>
        </div>
        <div className="group-item-info">
          <p>Effect:</p>
          <span> {item.effect_entries[0]?.short_effect}</span>
        </div>
        <div className="group-item-info">
          <p>Flavor Text:</p>
          <span> {getEnglishFlavorText(item)}</span>
        </div>

        <div className="group-item-info">
          <p>Attributes</p>
          <ul className="item-attributes">
            {item.attributes.map((attribute) => (
              <li key={attribute.name}>{formatString(attribute.name)}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
