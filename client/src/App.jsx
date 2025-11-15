import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router';
import { 
  login, 
  getUserInfo, 
  logOut, 
 } from './API/API.mjs';

import { Layout } from './components/Layout.jsx';
import { HomePage } from './pages/Home.jsx';
import { LoginPage } from './components/Login.jsx';
import { NotFound } from './pages/NotFound.jsx';
import { ArticlePage } from './pages/ArticlePage';
import { RegisterPage } from './components/Register.jsx';
import { MyArticlesPage } from './pages/MyArticles.jsx';
import { FavouritesPage } from "./pages/Favourite.jsx";
import { ScrollToTop } from "./components/ScrollToTop.jsx";
import { AuthorsPage } from "./pages/AuthorsPage.jsx";
import { AuthorPage } from "./pages/AuthorPage.jsx";
import { EventsPage } from "./pages/EventsPage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { AboutUsPage } from "./pages/AboutUsPage.jsx";
import { ContactsPage } from "./pages/ContactsPage.jsx";


function App() {

    const [user, setUser] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [selectedAuthorNickname, setSelectedAuthorNickname] = useState(null);

    const navigate = useNavigate();

    const handleLogin = async (credentials) => {
      try {
        const user = await login(credentials);
        setUser(user);
        navigate('/');
      }
      catch (error) {
        setUser(null);
        throw error;
      }
    }

    const handleLogout = async () => {
      try {
        await logOut();
        setUser(null);
        navigate('/');
      }
      catch (error) {
        throw error;
      }
    };


    useEffect(() => {
      const checkAuth = async () => {
        try {
          const user = await getUserInfo();
          setUser(user);
          console.log(user);
        } catch {
          setUser(null);
        }
      };
      checkAuth();
    }, []);


    return (
      <div className="App">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout
            user={user}
            handleLogout={handleLogout}
          />}>
            <Route index element={<HomePage 
              user={user}
              setSelectedArticle={setSelectedArticle}
              setSelectedAuthorNickname={setSelectedAuthorNickname}
              />} 
            />
            <Route path="login" element={<LoginPage 
              handleLogin={handleLogin}/>} />
            <Route path="register" element={<RegisterPage 
              />} />
            <Route path="/article" element={<ArticlePage 
              article={selectedArticle}
              user={user}
              />} />
            <Route path="/authors" element={<AuthorsPage 
              setSelectedAuthorNickname={setSelectedAuthorNickname} 
              />} />
            <Route path="/author" element={<AuthorPage 
              authorNickname={selectedAuthorNickname}
              setSelectedArticle={setSelectedArticle}
              setSelectedAuthorNickname={setSelectedAuthorNickname}
              />} />
            <Route path="/profile" element={<ProfilePage 
              user={user}
              setSelectedArticle={setSelectedArticle}
              setSelectedAuthorNickname={setSelectedAuthorNickname}
              />}/>
            <Route path="/myarticles" element={<MyArticlesPage 
              user={user}
              setSelectedArticle={setSelectedArticle}
              setSelectedAuthorNickname={setSelectedAuthorNickname}
              />}/>
            <Route path="/favourites" element={<FavouritesPage
              user={user}
              setSelectedArticle={setSelectedArticle}
              setSelectedAuthorNickname={setSelectedAuthorNickname}
            />}/>
            <Route path="/events" element={<EventsPage />} />
            <Route path="/aboutus" element={<AboutUsPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    )
}

export default App
