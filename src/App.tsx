import './App.css';
import { useState } from 'react';
import NavBar from '@/shared/components/NavBar';
import RoomView from '@/features/rooms/components/RoomView';
import HomeView from '@/features/home/components/HomeView';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

function AppContent() {
  const [isEditing, setEditing] = useState<boolean>(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className={`App ${(!isEditing && !isHome) ? 'nav-autohide' : ''}`}>
      <div className="nav-zone">
        <NavBar isEditing={isEditing} setEditing={setEditing} />
      </div>

      <Routes>
        <Route path="/:roomName" element={<RoomView isEditing={isEditing} />} />
        <Route path="/" element={<HomeView />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}