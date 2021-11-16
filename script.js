const { useState, useEffect, useRef } = React;

const url = "https://pokeapi.co/api/v2/pokemon/";

const statColors = {
  "special-defense": "#69D639",
  "special-attack": "#03A9FF",
  defense: "#9356F3",
  speed: "#F779A3",
  hp: "#E75E75",
  attack: "#F79963" };

const typeColors = {
  normal: "A8A77A",
  fire: "EE8130",
  water: "6390F0",
  electric: "F7D02C",
  grass: "7AC74C",
  ice: "96D9D6",
  fighting: "C22E28",
  poison: "A33EA1",
  ground: "E2BF65",
  flying: "A98FF3",
  psychic: "F95587",
  bug: "A6B91A",
  rock: "B6A136",
  ghost: "735797",
  dragon: "6F35FC",
  dark: "705746",
  steel: "B7B7CE",
  fairy: "D685AD" };

const Stat = ({ dataType, dataValue }) => {
  const color = statColors[dataType];
  const styles = {
    backgroundColor: color,
    width: dataValue / 255 * 100 + "%" };

  return /*#__PURE__*/(
    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement("div", { className: "label" },
    dataType === "special-attack" ?
    "sp. attack" :
    dataType === "special-defense" ?
    "sp. defense" :
    dataType, ": ", /*#__PURE__*/
    React.createElement("span", { style: { color: color } }, dataValue)), /*#__PURE__*/

    React.createElement("div", { className: "stat-total" }, /*#__PURE__*/
    React.createElement("div", { className: "stat", style: { ...styles } }))));
};

const Data = ({ data }) => /*#__PURE__*/
React.createElement("div", { className: "data-container" },
data.map((stat) => /*#__PURE__*/
React.createElement(Stat, { dataType: stat.stat.name, dataValue: stat.base_stat })));

const Types = ({ data }) => {
  return /*#__PURE__*/(
    React.createElement("div", { className: "types" },
    data.map((type) => /*#__PURE__*/
    React.createElement("span", {
      className: "type",
      style: { backgroundColor: "#" + typeColors[type.type.name] } },

    type.type.name))));
};

const Loader = ({ setShow, isLoading }) => {
  const [start, setStart] = useState(false);
  const [completed, setCompleted] = useState(false);
  let loader = useRef();
  let range = useRef();
  const tl = useRef();
  useEffect(() => {
    setTimeout(() => {
      setStart(true);
    }, 100);
    if (start) {
      tl.current = new gsap.timeline({
        timeScale: 0.5,
        onComplete: () => setCompleted(true) }).

      set(loader.current, { autoAlpha: 1 }).
      to(range.current, 3, { width: 90 + "%" });
    }
  }, [start, setShow]);
  useEffect(() => {
    // Check if animation hasn't started yet but the data has already loaded
    if (!start && !isLoading) {
      setShow(true);
    }
    // Speed up the animation when data has loaded
    if (start && !completed && !isLoading) {
      tl.current.timeScale(15);
    }
    // Waits for data to load after animation completed
    if (completed && !isLoading) {
      tl.current.to(range.current, 1, {
        width: 100 + "%",
        onComplete: () => setShow(true) });

    }
  }, [isLoading, setShow, start, completed]);
  return /*#__PURE__*/(
    React.createElement("div", { className: "loading" }, /*#__PURE__*/
    React.createElement("div", { className: "loader", ref: loader }, /*#__PURE__*/
    React.createElement("div", { className: "range", ref: range }))));
};

const PokeInfo = ({ pkmn, isLoading }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (isLoading) {
      setShow(false);
    }
  }, [isLoading]);
  return /*#__PURE__*/(
    React.createElement("div", { className: "sprite-container" },
    !show ? /*#__PURE__*/
    React.createElement(Loader, { isLoading: isLoading, setShow: setShow }) : /*#__PURE__*/

    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement("div", { className: "id" }, "#", pkmn.id), /*#__PURE__*/
    React.createElement("div", { className: "img-wrapper" }, /*#__PURE__*/
    React.createElement("img", {
      className: "sprite",
      src: pkmn.sprites.front_default,
      alt: pkmn.name })), /*#__PURE__*/

    React.createElement("h3", { className: "name" }, pkmn.name), /*#__PURE__*/
    React.createElement(Types, { data: pkmn.types }))));
};

const PokemonCard = ({ pkmn, isLoading, children }) => {
  return /*#__PURE__*/(
    React.createElement("div", { id: "card" },
    children, /*#__PURE__*/
    React.createElement(PokeInfo, { isLoading: isLoading, pkmn: pkmn }), /*#__PURE__*/
    React.createElement(Data, { data: pkmn.stats })));
};

const Buttons = ({ pkmn, setLink, isLoading }) => {
  const updateLink = updateType => {
    switch (updateType) {
      case "random":{
          setLink(url + Math.floor(Math.random() * 810));
          break;
        }
      case "up":{
          if (pkmn.id < 811) {
            setLink(url + (pkmn.id + 1));
            break;
          }
          break;
        }
      case "down":{
          if (pkmn.id > 1) {
            setLink(url + (pkmn.id - 1));
            break;
          }
          break;
        }
      default:
        break;}

  };
  const buttonVals = {
    random: "♻",
    up: "▲",
    down: "▼" };

  return /*#__PURE__*/(
    React.createElement("div", { className: "btns" },
    Object.entries(buttonVals).map((pair) => /*#__PURE__*/
    React.createElement("button", { onClick: () => updateLink(pair[0]), disabled: isLoading },
    pair[1]))));
};

const ResultItem = ({ pkmn, setLink, setQuery, query }) => {
  handleClick = () => {
    setQuery("");
    setLink(pkmn.url);
  };
  //console.log(pkmn.name.split(query));
  return /*#__PURE__*/(
    React.createElement("li", { className: "result-item", onClick: handleClick },
    pkmn.name));
};

const Results = ({ results, setLink, setQuery, query }) => {
  return /*#__PURE__*/(
    React.createElement("ul", { id: "results" },
    results.map((pkmn) => /*#__PURE__*/
    React.createElement(ResultItem, {
      pkmn: pkmn,
      setLink: setLink,
      setQuery: setQuery,
      query: query }))));
};

const SearchIcon = () => /*#__PURE__*/React.createElement("div", { id: "icon" }, "🔍");

const SearchInput = ({
  setQuery,
  query,
  handleFocus,
  displayResults,
  firstResult }) =>
{
  handleChange = e => {
    e.preventDefault();
    setQuery(e.target.value);
  };
  return /*#__PURE__*/(
    React.createElement("form", { autocomplete: "off" }, /*#__PURE__*/
    React.createElement("input", {
      type: "search",
      results: 5,
      placeholder: "Search for a Pok\xE9mon by name or ID",
      id: "search-bar",
      onChange: handleChange,
      value: query,
      onFocus: handleFocus,
      style: {
        borderBottomLeftRadius: displayResults ? 0 : 10,
        borderBottomRightRadius: displayResults ? 0 : 10 } })));
};

const SearchBar = ({ all, setLink }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [displayResults, toggleResults] = useState(false);
  const searchRef = useRef(null);
  handleClickOutside = e => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      toggleResults(false);
    }
  };
  handleFocus = () => {
    results.length > 0 ? toggleResults(true) : toggleResults(false);
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  useEffect(() => {
    let res = [];
    if (query !== "") {
      const intQuery = parseInt(query);
      if (!isNaN(query) && intQuery <= 811 && intQuery >= 1) {
        const index = intQuery - 1;
        res = [all[index]];
      } else {
        res = all.filter((pkmn) =>
        pkmn.name.startsWith(query.trim().toLowerCase()));

      }
      setResults(res);
      if (res && res.length > 0) toggleResults(true);
    } else {
      setResults(res);
      toggleResults(false);
    }
  }, [query]);
  useEffect(() => {
    handleFocus();
  }, [results]);
  return /*#__PURE__*/(
    React.createElement("div", { id: "search-wrapper", ref: searchRef }, /*#__PURE__*/
    React.createElement(SearchIcon, null), /*#__PURE__*/
    React.createElement(SearchInput, {
      query: query,
      setQuery: setQuery,
      handleFocus: handleFocus,
      displayResults: displayResults,
      firstResult: results[0] }),

    displayResults && /*#__PURE__*/
    React.createElement(Results, {
      results: results,
      setLink: setLink,
      query: query,
      setQuery: setQuery })));
};

const App = () => {
  const [link, setLink] = useState(url + 1);
  const [pkmn, setPkmn] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [all, setAll] = useState([]);

  useEffect(() => {
    const getAll = async () => {
      try {
        const res = await axios.get(
        "https://pokeapi.co/api/v2/pokemon/?limit=811");

        const data = res.data.results;
        setAll(data);
      } catch (err) {
        console.log(err);
      }
    };
    getAll();
  }, []);

  useEffect(() => {
    const fetchPkmn = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(link);
        setPkmn(res.data);
        setIsLoading(false);
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    };
    fetchPkmn();
  }, [link, setPkmn, setIsLoading]);
  return /*#__PURE__*/(
    React.createElement("div", { id: "main" }, /*#__PURE__*/
    React.createElement(SearchBar, { all: all, setLink: setLink }),
    pkmn && /*#__PURE__*/
    React.createElement(PokemonCard, { isLoading: isLoading, pkmn: pkmn }, /*#__PURE__*/
    React.createElement(Buttons, { isLoading: isLoading, pkmn: pkmn, setLink: setLink }))));
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("root"));