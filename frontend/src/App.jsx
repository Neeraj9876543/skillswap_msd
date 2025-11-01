import { useState } from 'react'
import './App.css'
import Home from './pages/Home';
import Login from './pages/Login'
import Signup from './pages/Signup'
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import BrowseSkills from './pages/BrowseSkills';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'
import HowItWorks from './pages/HowItWorks'
import FAQ from './pages/Faq'
import About from './pages/AboutUs'
import Message from './pages/Messages'
import FavoritesPage from './pages/Favorites';
import Contact from './pages/Contact';
function AppContent() {
  const location = useLocation();
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/browse" element={<BrowseSkills />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/protectedroute" element={<ProtectedRoute />} />
        <Route path="/works" element={<HowItWorks />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/about" element={<About />} />
        <Route path="/messages" element={<Message />} />
        <Route path="/messages/:code" element={<Message />} />
        <Route path='/favorites' element={<FavoritesPage />}/>
        <Route path="/contact" element={<Contact />} />
      </Routes>
      {!location.pathname.startsWith('/messages') && <Footer />}
    </>
  );
}
function App() {
  const [count, setCount] = useState(0)
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
export default App
