import { BrowserRouter, Route, Routes } from "react-router";
import { Bounce, ToastContainer } from "react-toastify";
import MainLayout from "./layouts/MainLayout";
import Usuarios from "./pages/usuarios/Usuarios";
import Eventos from "./pages/eventos/Eventos";
import Setores from "./pages/setores/Setores";
import Clientes from "./pages/clientes/Clientes";
import Reservas from "./pages/reservas/Reservas";
import Dashboard from "./pages/Dashboard";


function App() {

  const usuario = {
    "id_usuario":1,
    "nome":"Luiz Fabiano",
    "id_perfil":1,
    "perfil":"Administrador"
  }

  window.sessionStorage.setItem('user',JSON.stringify(usuario))

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="usuarios/*" element={<MainLayout><Usuarios/></MainLayout>} />
          <Route path="clientes/*" element={<MainLayout><Clientes/></MainLayout>} />
          <Route path="eventos/*" element={<MainLayout><Eventos/></MainLayout>} />
          <Route path="setores/*" element={<MainLayout><Setores/></MainLayout>} />
          <Route path="reservas/*" element={<MainLayout><Reservas/></MainLayout>} />
          <Route path="dashboard/:idEvento" element={<MainLayout><Dashboard/></MainLayout>} />
          <Route path="*" element={<MainLayout><h1>Página não encontrada</h1></MainLayout>} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
}

export default App;
