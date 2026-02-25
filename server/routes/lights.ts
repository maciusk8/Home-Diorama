import { Elysia } from 'elysia';
import * as DB from '../db';

export const lightsRoutes = new Elysia({ prefix: '/lights' })
    .post('/', ({ body }) => {
        const light = body as any;
        DB.insertLight(light);
        return { success: true, id: light.id };
    })
    .put('/:id', ({ params: { id }, body }) => {
        const light = { id, ...(body as any) };
        DB.updateLight(light);
        return { success: true };
    })
    .delete('/:id', ({ params: { id } }) => {
        DB.removeLight(id);
        return { success: true };
    });
