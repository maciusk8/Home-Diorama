import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { DbPin, DbRoom } from '../../../../server/db/types';

/**
 * Encapsulates all room + pin CRUD mutations.
 * Each mutation invalidates the homeData cache on success.
 */
export default function useRoomMutations() {
    const queryClient = useQueryClient();

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['homeData'] });

    const updateRoomMutation = useMutation({
        mutationFn: (room: DbRoom) =>
            fetch(`/api/local/rooms/${room.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: room.name, image: room.image, nightImage: room.nightImage, bgColor: room.bgColor }),
            }),
        onSuccess: invalidate,
    });

    const addPinMutation = useMutation({
        mutationFn: (pin: DbPin) =>
            fetch('/api/local/pins', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pin),
            }),
        onSuccess: invalidate,
    });

    const updatePinMutation = useMutation({
        mutationFn: (pin: DbPin) =>
            fetch(`/api/local/pins/${pin.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roomId: pin.roomId,
                    typeId: pin.typeId,
                    x: pin.x,
                    y: pin.y,
                    customName: pin.customName ?? null,
                }),
            }),
        onSuccess: invalidate,
    });

    const deletePinMutation = useMutation({
        mutationFn: (id: string) =>
            fetch(`/api/local/pins/${id}`, { method: 'DELETE' }),
        onSuccess: invalidate,
    });

    return {
        updateRoom: (room: DbRoom, patch: Partial<DbRoom>) =>
            updateRoomMutation.mutate({ ...room, ...patch }),

        addPin: (pin: DbPin) =>
            addPinMutation.mutate(pin),

        updatePin: (pins: DbPin[], pinId: string, patch: Partial<DbPin>) => {
            const pin = pins.find(p => p.id === pinId);
            if (pin) updatePinMutation.mutate({ ...pin, ...patch });
        },

        removePin: (pinId: string) =>
            deletePinMutation.mutate(pinId),
    };
}
