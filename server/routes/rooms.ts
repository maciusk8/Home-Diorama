import { Elysia } from 'elysia';
import * as DB from '../db/index';

export const roomsRoutes = new Elysia({ prefix: '/rooms' })
    .get('/', () => DB.getRoomsData())
    .get('/:id', ({ params: { id } }) => DB.getRoomById(id))
    .post('/', ({ body }) => {
        const room = body as any;
        DB.insertRoom(room);
        return { success: true, id: room.id };
    })
    .put('/:id', ({ params: { id }, body }) => {
        const room = { id, ...(body as any) };
        DB.updateRoom(room);
        return { success: true };
    })
    .delete('/:id', ({ params: { id } }) => {
        DB.removeRoom(id);
        return { success: true };
    });
