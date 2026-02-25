import { Elysia } from 'elysia';
import * as DB from '../db';

export const areasRoutes = new Elysia({ prefix: '/areas' })
    .post('/', ({ body }) => {
        const area = body as any;
        DB.insertArea(area);
        return { success: true, id: area.id };
    })
    .put('/:id', ({ params: { id }, body }) => {
        const area = { id, ...(body as any) };
        DB.updateArea(area);
        return { success: true };
    })
    .delete('/:id', ({ params: { id } }) => {
        DB.removeArea(id);
        return { success: true };
    });
