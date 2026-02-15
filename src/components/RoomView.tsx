import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Room } from '../types/rooms';
import ImageDisplay from './ImageDisplay';
import EntityDropdown from './EntityDropdown';
import WheelPalette from './WheelPalette';
import { useEntities } from '../hooks/useEntities';

export default function RoomView({ rooms, setRooms, isEditing }: { rooms: Room[], setRooms: (rooms: Room[]) => void, isEditing: boolean }) {
    const { roomName } = useParams();
    const entitiesFromHook = useEntities();

    const currentRoom = rooms.find(room => room.name === roomName);

    const changeImage = (newImage: string) => {
        if (currentRoom) {
            const updatedRoom = { ...currentRoom, image: newImage };

            setRooms(rooms.map(room =>
                room.name === currentRoom.name ? updatedRoom : room
            ));
        }
    }

    const changeBackgroundColor = (color: string) => {
        if (currentRoom) {
            const updatedRoom = { ...currentRoom, bgColor: color };

            setRooms(rooms.map(room =>
                room.name === currentRoom.name ? updatedRoom : room
            ));
        }
    }

    useEffect(() => {
        if (currentRoom?.bgColor) {
            document.body.style.backgroundColor = currentRoom.bgColor;
        } else {
            document.body.style.backgroundColor = '';
        }
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, [currentRoom?.bgColor]);

    if (!currentRoom) {
        return <div style={{ color: 'red' }}>Room not found: {roomName}</div>;
    }

    return (
        <div className='roomView'
        >
            {isEditing && (
                <div className="entity-sidebar">
                    <EntityDropdown entities={entitiesFromHook} />
                </div>
            )}
            <ImageDisplay image={currentRoom.image} changeImage={changeImage} isEditing={isEditing} />
            {isEditing && (
                <WheelPalette
                    currentColor={currentRoom.bgColor}
                    onColorChange={changeBackgroundColor}
                />
            )}
        </div>
    );
}