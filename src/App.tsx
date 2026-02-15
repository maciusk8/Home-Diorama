import './App.css';
import { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import RoomView from './components/RoomView';
import type { Room } from './types/rooms';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export default function App() {
  const [isEditing, setEditing] = useState<boolean>(false);
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem("rooms");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("rooms", JSON.stringify(rooms));
  }, [rooms]);

  const navProps = {
    rooms,
    setRooms,
    isEditing,
    setEditing
  };


  return (
    <BrowserRouter>
      <div className="App">
        <NavBar {...navProps} />

        <Routes>
          <Route path="/:roomName" element={<RoomView rooms={rooms} setRooms={setRooms} isEditing={isEditing} />} />
          <Route path="/" element={<div>Choose or add a room from the navigation bar</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}