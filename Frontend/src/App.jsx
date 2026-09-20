import { Routes, Route } from "react-router";

import LandingPage from "./pages/Landing";
import LoginPage from "./pages/Login";
import CreateLeague from "./pages/Create";
import JoinLeague from "./pages/Join";
import UnreadyPage from "./pages/Unready";
import ReadyPage from "./pages/Ready";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/create" element={<CreateLeague />} />
      <Route path="/join" element={<JoinLeague />} />
      <Route path="/unready" element={<UnreadyPage />} />
      <Route path="/ready" element={<ReadyPage />} />
    </Routes>
  )
}

export default App;
