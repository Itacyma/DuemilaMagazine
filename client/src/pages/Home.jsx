import { useEffect, useState } from "react";
import { Alert, Button, Container, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router";
import { getPublicArticles, getPrivateArticles, getCategories } from "../API/API.mjs";
import '../style/Home.css';

import { ArticlesDM } from '../components/Articles';
import { BannerGameDM } from "../components/BannerGame";
import { FilterSearchDM } from '../components/FilterSearch';

const SERVER_URL = "http://localhost:3001";

function HomePage(props) {
  const navigate = useNavigate();
  const { user, setSelectedArticle, setSelectedAuthorNickname } = props;
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchArticles = async () => {
      try {
        const data = user ? await getPrivateArticles() : await getPublicArticles();
        setArticles(data);
      } catch (err) {
        setError("Errore nel caricamento degli articoli");
      }
      setLoading(false);
    };
    fetchArticles();
  }, [user]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        // errore silenzioso
      }
    };
    fetchCategories();
  }, []);

  const filteredArticles = articles.filter(a => {
    const matchesTitle = a.title.toLowerCase().includes(searchTitle.toLowerCase());
    const matchesAuthor = !searchAuthor || 
      (a.author && a.author.toLowerCase().includes(searchAuthor.toLowerCase())) ||
      (a.nickname && a.nickname.toLowerCase().includes(searchAuthor.toLowerCase()));
    const matchesCategory = selectedCategories.length === 0 ||
      selectedCategories.includes(a.category?.toLowerCase());
    
    return matchesTitle && matchesAuthor && matchesCategory;
  });

  return (
    <div style={{ paddingBottom: 112 }}>
      <BannerGameDM user={user}/>
      <Container className="home-page" >
        <FilterSearchDM
          searchTitle={searchTitle}
          setSearchTitle={setSearchTitle}
          searchAuthor={searchAuthor}
          setSearchAuthor={setSearchAuthor}
          categories={categories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
        <h1 className="mb-5 mt-4 section-title">Suggeriti:</h1>
        <div className="mb-4 d-flex justify-content-center">
          {loading ? (
            <Spinner animation="border" />
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <ArticlesDM
              articles={
                searchTitle || searchAuthor || selectedCategories.length > 0
                  ? filteredArticles
                  : articles
              }
              setSelectedArticle={setSelectedArticle}
              setSelectedAuthorNickname={setSelectedAuthorNickname}
              orderCriteria={
                searchTitle || searchAuthor || selectedCategories.length > 0
                  ? "visuals"
                  : "random"
              }
            />
          )}
        </div>
      </Container>

      <hr style={{ borderTop: '3px solid #662E9B', margin: '3rem 0' }} />

      <Container className="home-page" >
        <h1 className="mb-5 section-title">Ultime uscite:</h1>
        <ArticlesDM articles={articles} setSelectedArticle={setSelectedArticle} setSelectedAuthorNickname={setSelectedAuthorNickname} orderCriteria={'date'}/>
      </Container>

      <hr style={{ borderTop: '3px solid #662E9B', margin: '3rem 0' }} />

      <Container className="home-page" >
        <h1 className="mb-5 section-title">I più visti:</h1>
        <ArticlesDM articles={articles} setSelectedArticle={setSelectedArticle} setSelectedAuthorNickname={setSelectedAuthorNickname} orderCriteria={'visuals'}/>
      </Container>

      <hr style={{ borderTop: '3px solid #662E9B', margin: '3rem 0' }} />

      <Container className="home-page" >
        <h1 className="mb-5 section-title">I più apprezzati:</h1>
        <ArticlesDM articles={articles} setSelectedArticle={setSelectedArticle} setSelectedAuthorNickname={setSelectedAuthorNickname} orderCriteria={'likes'}/>
      </Container>
    </div>
  );
}

export {HomePage};
                        