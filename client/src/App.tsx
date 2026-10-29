import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Chat from "./pages/Chat";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/chat" replace />} />

        <Route path="/signup" element={<SignUp />} />

        <Route path="/chat" element={<Chat />} />

        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
