import { useParams } from 'react-router-dom';
import type { Room } from '../types/rooms';
import ImageDisplay from './ImageDisplay';
import { Dropdown } from 'react-bootstrap';
import EntityDropdown from './EntityDropdown';
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

    if (!currentRoom) {
        return <div style={{ color: 'red' }}>Room not found: {roomName}</div>;
    }

    return (
        <div className='roomView'>
            {isEditing && (
                <div className="entity-sidebar">
                    <EntityDropdown entities={entitiesFromHook} />
                </div>
            )}
            <ImageDisplay image={currentRoom.image} changeImage={changeImage} isEditing={isEditing} />
        </div>
    );
}