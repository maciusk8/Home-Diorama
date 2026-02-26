import WheelPalette from '@/shared/components/WheelPalette';
import NightViewSetter from '@/shared/components/NightViewSetter';
import type { DbRoom } from '../../../../server/db/types';

interface RoomToolbarProps {
    room: DbRoom;
    updateRoom: (room: DbRoom, patch: Partial<DbRoom>) => void;
}

/**
 * Bottom-right editing toolbar for a room.
 * Contains the night image setter and background color picker.
 */
export default function RoomToolbar({ room, updateRoom }: RoomToolbarProps) {
    return (
        <div className="bottom-right-corner-container">
            {room.image &&
                <NightViewSetter onNightImageUpload={(img: string | null) => updateRoom(room, { nightImage: img })} />
            }
            <WheelPalette
                currentColor={room.bgColor || ''}
                onColorChange={(color: string) => updateRoom(room, { bgColor: color })}
            />
        </div>
    );
}
