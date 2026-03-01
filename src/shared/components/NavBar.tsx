import { Nav, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import useHomeData from '@/shared/hooks/useHomeData';
import { generateSlugs } from '@/shared/utils/roomSlugs';
import useRoomMutations from '@/shared/hooks/useRoomMutations';
import './NavBar.css';

export default function NavBar({ isEditing, setEditing }:
    { isEditing: boolean; setEditing: React.Dispatch<React.SetStateAction<boolean>> }) {

    const { rooms } = useHomeData();
    const { addRoom, removeRoom, renameRoom } = useRoomMutations();

    const slugMap = rooms ? generateSlugs(rooms) : new Map<string, string>();

    return isEditing ? (
        <Nav className='nav'>
            {rooms?.map((room) => (
                <Nav.Item key={room.id}>
                    <Nav.Link
                        onClick={() => renameRoom(room)}
                        className="d-flex justify-content-between align-items-center"
                    >
                        {room.name}
                        <div
                            className='deleteName nav-item-right'
                            onClick={(e) => {
                                e.stopPropagation();
                                removeRoom(room.id);
                            }}>
                            x
                        </div>
                    </Nav.Link>
                </Nav.Item>
            ))}

            <Nav.Item>
                <Nav.Link onClick={() => addRoom()}>+</Nav.Link>
            </Nav.Item>

            <Nav.Item className="nav-item-right">
                <Button onClick={() => setEditing(false)}>done</Button>
            </Nav.Item>
        </Nav>

    ) : (
        <Nav className='nav'>
            {rooms?.map((room) => (
                <Nav.Item key={room.id}>
                    <Nav.Link as={NavLink} to={`/${slugMap.get(room.id)}`}>
                        {room.name}
                    </Nav.Link>
                </Nav.Item>
            ))}

            <Nav.Item className="nav-item-right">
                <Button onClick={() => setEditing(true)}>edit</Button>
            </Nav.Item>
        </Nav>
    )
}