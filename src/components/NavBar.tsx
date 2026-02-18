import { Nav, Button } from 'react-bootstrap';
import type { Room } from '../types/rooms';
import { NavLink } from 'react-router-dom';

const messages: string[] = [
    "Enter room name:",
    "Name must be unique and not empty.",
];

const inputMessage = messages[0];
const errorMessage = messages[1];


export default function NavBar({ rooms, setRooms, isEditing, setEditing }:
    { rooms: Room[]; setRooms: React.Dispatch<React.SetStateAction<Room[]>>; isEditing: boolean; setEditing: React.Dispatch<React.SetStateAction<boolean>> }) {

    const addRoom = () => {
        const name = prompt(inputMessage);
        if (name && ensureUniqueNames(name, -1)) {
            const room: Room = {
                name,
                image: null,
                bgColor: '',
                entities: []
            };
            setRooms([...rooms, room]);
        }
        else {
            alert(errorMessage);
        }
    }

    const removeRoom = (index: number) => {
        setRooms(rooms.filter((_, i) => i !== index));
    }

    const renameRoom = (index: number) => {
        const currentName = rooms[index].name || "";
        const newName = prompt(inputMessage, currentName);

        if (newName && ensureUniqueNames(newName, index)) {
            const updatedRooms = [...rooms];
            updatedRooms[index] = { ...updatedRooms[index], name: newName };
            setRooms(updatedRooms);
        }
        else {
            alert(errorMessage);
        }
    }

    const ensureUniqueNames = (name: string, index: number) => {
        return rooms.every((room, i) => i === index || room.name !== name);
    }

    return isEditing ? (
        <Nav variant="tabs" className='nav'>
            {rooms.map((room, index) => (
                <Nav.Item key={index}>
                    <Nav.Link
                        onClick={() => renameRoom(index)}
                        className="d-flex justify-content-between align-items-center"
                    >
                        {room.name}
                        <div
                            className='deleteName'
                            style={{ marginLeft: '0.625rem', cursor: 'pointer' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                removeRoom(index);
                            }}>
                            x
                        </div>
                    </Nav.Link>
                </Nav.Item>
            ))}

            <Nav.Item>
                <Nav.Link onClick={() => addRoom()}>+</Nav.Link>
            </Nav.Item>

            <Nav.Item style={{ marginLeft: 'auto', scale: 0.75 }}>
                <Button onClick={() => setEditing(false)}>done</Button>
            </Nav.Item>
        </Nav>

    ) : (
        <Nav variant="tabs" className='nav'>
            {rooms.map((room, index) => (
                <Nav.Item key={index}>
                    <Nav.Link as={NavLink} to={`/${room.name}`}>
                        {room.name}
                    </Nav.Link>
                </Nav.Item>
            ))}

            <Nav.Item style={{ marginLeft: 'auto', scale: 0.75 }}>
                <Button onClick={() => setEditing(true)}>edit</Button>
            </Nav.Item>
        </Nav>
    )
}