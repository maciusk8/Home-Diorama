import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { DbRoom } from '../../../server/db/types';

export default function useRoomMutations() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const addRoomMutation = useMutation({
        mutationFn: (room: DbRoom) =>
            fetch('/api/local/rooms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(room),
            }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['homeData'] }),
    });

    const updateRoomMutation = useMutation({
        mutationFn: (room: DbRoom) =>
            fetch(`/api/local/rooms/${room.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: room.name, image: room.image, nightImage: room.nightImage, bgColor: room.bgColor }),
            }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['homeData'] }),
    });

    const deleteRoomMutation = useMutation({
        mutationFn: (id: string) =>
            fetch(`/api/local/rooms/${id}`, { method: 'DELETE' }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['homeData'] }),
    });

    const addRoom = () => {
        const name = prompt("Enter room name:");
        if (!name) return;

        const id = crypto.randomUUID();

        const room: DbRoom = {
            id,
            name,
            image: null,
            nightImage: null,
            bgColor: '#ffffff',
        };
        addRoomMutation.mutate(room);
    };

    const removeRoom = (id: string) => {
        deleteRoomMutation.mutate(id);
    };

    const renameRoom = (room: DbRoom) => {
        const newName = prompt("Enter room name:", room.name);
        if (!newName || newName === room.name) return;

        updateRoomMutation.mutate({ ...room, name: newName });
        navigate(`/${newName}`);
    };

    return {
        addRoom,
        removeRoom,
        renameRoom,
        addRoomMutation,
        updateRoomMutation,
        deleteRoomMutation
    };
}
