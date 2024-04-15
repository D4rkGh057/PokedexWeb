import { Navigate, Route, Routes } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { SearchPage, HomePage, PokemonPage, LoginPage,RegisterPage, UserPage } from "./pages";
import { ScrollToTop } from "./components/TopScroll";

export const AppRouter = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route index element={<HomePage />} />
          <Route path="pokemon/:id" element={<PokemonPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="user" element={<UserPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </>
  );
};
//IMPORTANTE: LA RUTA USER PUEDE USARSE COMO USER/ :NICKNAME PARA VER EL PERFIL DE UN USUARIO EN ESPECIFICO