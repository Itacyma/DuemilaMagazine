import {Button} from 'react-bootstrap';
import { useNavigate } from "react-router";


function FilterSearchDM(props) {
  const {
    searchTitle,
    setSearchTitle,
    searchAuthor,
    setSearchAuthor,
    categories,
    selectedCategories,
    setSelectedCategories
  } = props;

  return (
    <div className="home-search-bar-wrapper">
      <div style={{ position: "relative", width: "100%" }}>
        <input
          type="text"
          className="form-control home-search-bar"
          placeholder="Cerca per titolo..."
          value={searchTitle}
          onChange={e => setSearchTitle(e.target.value)}
        />
        {searchTitle && (
          <span
            className="home-search-bar-x"
            onClick={() => setSearchTitle("")}
            title="Cancella"
          >
            ×
          </span>
        )}
      </div>
      <div style={{ position: "relative", width: "100%" }}>
        <input
          type="text"
          className="form-control home-search-bar"
          placeholder="Cerca per autore..."
          value={searchAuthor}
          onChange={e => setSearchAuthor(e.target.value)}
        />
        {searchAuthor && (
          <span
            className="home-search-bar-x"
            onClick={() => setSearchAuthor("")}
            title="Cancella"
          >
            ×
          </span>
        )}
      </div>
      <div className="home-category-btn-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {(() => {
          const rows = [];
          for (let i = 0; i < categories.length; i += 4) {
            const rowCats = categories.slice(i, i + 4);
            rows.push(
              <div key={i} style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                {rowCats.map(cat => {
                  const catName = cat.name.toLowerCase();
                  const isActive = selectedCategories.includes(catName);

                  const toggleCategory = () => {
                    setSelectedCategories(prev =>
                      prev.includes(catName)
                        ? prev.filter(c => c !== catName)
                        : [...prev, catName]
                    );
                  };

                  return (
                    <Button
                      key={cat.id}
                      className={`home-category-btn${isActive ? " active" : ""}`}
                      onClick={toggleCategory}
                    >
                      {cat.name.toUpperCase()}
                    </Button>
                  );
                })}
              </div>
            );
          }
          return rows;
        })()}
      </div>
    </div>
  );
}

export { FilterSearchDM };