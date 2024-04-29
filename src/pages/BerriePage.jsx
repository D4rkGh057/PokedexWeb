import { useParams } from "react-router-dom";
import { BerriesContext } from "../context/BerriesContext";
import { useContext, useEffect, useState } from "react";
import { Loader } from "../components";
import "./Berries.css";

export const BerriePage = () => {
  const { id } = useParams();
  const { getBerriesByID } = useContext(BerriesContext);
  const [loading, setLoading] = useState(true);
  const [berry, setBerry] = useState({});

  const fetchBerry = async (id) => {
    const data = await getBerriesByID(id);
    setBerry(data);
    setLoading(false);
  };

  function formatString(str) {
    return str
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  useEffect(() => {
    fetchBerry(id);
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", margin: "28%" }}>
        <Loader />
      </div>
    );
  }
  return (
    <div className="main-berrie">
      <h1 className="titles">{formatString(berry.name)}</h1>
      <div className="header-main-berrie">
        <img
          src={`https://raw.githubusercontent.com/D4rkGh057/sprites_pokedex/main/Bayas/${berry.name}.png`}
          alt={berry.name}
        />
        <div className="flavors">
          {berry.flavors
            .filter((flavor) => flavor.potency > 0)
            .map((flavor) => (
              <span className={flavor.flavor.name} key={flavor.flavor.name}>
                {formatString(flavor.flavor.name)}
              </span>
            ))}
        </div>
      </div>
      <div className="header-main-berrie">
        <div className="group-info">
          <p>Growth Time:</p>
          <span> {berry.growth_time} hours / cicle</span>
        </div>
        <div className="group-info">
          <p>Max Harvest:</p>
          <span> {berry.max_harvest}</span>
        </div>
        <div className="group-info">
          <p>Size:</p>
          <span> {berry.size / 10} CM</span>
        </div>
        <div className="group-info">
          <p>Firmness:</p>
          <span> {formatString(berry.firmness.name)}</span>
        </div>
        <div className="group-info">
          <p>Natural Gift:</p>
          <div className="card-types">
            <span className={berry.natural_gift_type.name}>
              {formatString(berry.natural_gift_type.name)}
            </span>
          </div>
        </div>
      </div>
      <div>
        <div className="berry-cicles">
          <div className="cicle">
            <h1 className="titles">Seed</h1>
            <img
              src={`https://raw.githubusercontent.com/D4rkGh057/sprites_pokedex/main/ArbolesBayas/alltreeseed.png`}
              alt={berry.name}
            />
          </div>
          <div className="cicle">
            <h1 className="titles">Budding</h1>
            <img
              src={`https://raw.githubusercontent.com/D4rkGh057/sprites_pokedex/main/ArbolesBayas/${berry.name}treebudding.png`}
              alt={berry.name}
              onError={(e) => { e.target.src="https://raw.githubusercontent.com/D4rkGh057/sprites_pokedex/main/ArbolesBayas/none.png" }}
            />
          </div>
          <div className="cicle">
            <h1 className="titles">Flowering</h1>
            <img
              src={`https://raw.githubusercontent.com/D4rkGh057/sprites_pokedex/main/ArbolesBayas/${berry.name}treebloom.png`}
              alt={berry.name}
              onError={(e) => { e.target.src="https://raw.githubusercontent.com/D4rkGh057/sprites_pokedex/main/ArbolesBayas/none.png" }}
            />
          </div>
          <div className="cicle">
            <h1 className="titles">Berry</h1>
            <img
              src={`https://raw.githubusercontent.com/D4rkGh057/sprites_pokedex/main/ArbolesBayas/${berry.name}treeberry.png`}
              alt={berry.name}
              onError={(e) => { e.target.src="https://raw.githubusercontent.com/D4rkGh057/sprites_pokedex/main/ArbolesBayas/none.png" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
