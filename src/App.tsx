import './App.css';
import { useState } from 'react';
import NavBar from './components/NavBar';
import RoomView from './components/RoomView';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export default function App() {
  const [isEditing, setEditing] = useState<boolean>(false);

  return (
    <BrowserRouter>
      <div className={`App ${!isEditing ? 'nav-autohide' : ''}`}>
        <div className="nav-zone">
          <NavBar isEditing={isEditing} setEditing={setEditing} />
        </div>

        <Routes>
          <Route path="/:roomName" element={<RoomView isEditing={isEditing} />} />
          <Route path="/" element={<div>Choose or add a room from the navigation bar</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}