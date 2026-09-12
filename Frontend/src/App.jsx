import { Routes, Route } from "react-router";

import LandingPage from "./pages/Landing";
import LoginPage from "./pages/Login";
import CreateLeague from "./pages/Create";
import JoinLeague from "./pages/Join";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/create" element={<CreateLeague />} />
      <Route path="/join" element={<JoinLeague />} />
    </Routes>
  )
}

export default App;
