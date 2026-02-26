import { Elysia, t } from 'elysia';
import * as DB from '../db/index';

const roomBody = t.Object({
    id: t.String(),
    name: t.String(),
    image: t.Optional(t.Nullable(t.String())),
    nightImage: t.Optional(t.Nullable(t.String())),
    bgColor: t.Optional(t.String()),
});

const roomUpdateBody = t.Object({
    name: t.String(),
    image: t.Optional(t.Nullable(t.String())),
    nightImage: t.Optional(t.Nullable(t.String())),
    bgColor: t.Optional(t.String()),
});

export const roomsRoutes = new Elysia({ prefix: '/rooms' })
    .get('/', ({ set }) => {
        try {
            return DB.getRoomsData();
        } catch (error) {
            set.status = 500;
            return { success: false, error: 'Failed to fetch rooms data' };
        }
    })
    .get('/:id', ({ params: { id }, set }) => {
        try {
            const room = DB.getRoomById(id);
            if (!room) {
                set.status = 404;
                return { success: false, error: 'Room not found' };
            }
            return room;
        } catch (error) {
            set.status = 500;
            return { success: false, error: 'Failed to fetch room' };
        }
    })
    .post('/', ({ body, set }) => {
        try {
            DB.insertRoom(body);
            return { success: true, id: body.id };
        } catch (error) {
            set.status = 400;
            return { success: false, error: 'Failed to insert room' };
        }
    }, { body: roomBody })
    .put('/:id', ({ params: { id }, body, set }) => {
        try {
            DB.updateRoom({ id, ...body });
            return { success: true };
        } catch (error) {
            set.status = 400;
            return { success: false, error: 'Failed to update room' };
        }
    }, { body: roomUpdateBody })
    .delete('/:id', ({ params: { id }, set }) => {
        try {
            DB.removeRoom(id);
            return { success: true };
        } catch (error) {
            set.status = 400;
            return { success: false, error: 'Failed to delete room' };
        }
    });
