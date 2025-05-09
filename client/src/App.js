import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/common/Header";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Game from "./pages/Game";
import GameModeSelect from "./pages/GameModeSelect";
import NormalModeLevelSelect from "./pages/NormalModeLevelSelect"; // New import
import Achievements from "./pages/Achievements";
import Profile from "./pages/Profile";
import AboutMe from "./pages/AboutMe"; // Import the AboutMe component
import soundService from "./services/soundService";
import "./App.css";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;
  return isAuthenticated ? children : <Navigate to="/signin" />;
};

function App() {
  useEffect(() => {
    // Preload all sounds when app loads
    soundService.preloadSounds();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/about" element={<AboutMe />} /> {/* New route for AboutMe page */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/game-mode"
                element={
                  <ProtectedRoute>
                    <GameModeSelect />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/normal-mode-levels"
                element={
                  <ProtectedRoute>
                    <NormalModeLevelSelect />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/game"
                element={
                  <ProtectedRoute>
                    <Game />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/achievements"
                element={
                  <ProtectedRoute>
                    <Achievements />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <footer className="app-footer">
            <p>© {new Date().getFullYear()} Math Adventure Game</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;