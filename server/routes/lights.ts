import { Elysia, t } from 'elysia';
import * as DB from '../db/index';

const lightBody = t.Object({
    id: t.String(),
    roomId: t.String(),
    typeId: t.String(),
    maxBrightness: t.Number(),
    radius: t.Number(),
    angle: t.Number(),
    spread: t.Number(),
    x: t.Number(),
    y: t.Number(),
});

const lightUpdateBody = t.Object({
    roomId: t.String(),
    typeId: t.String(),
    maxBrightness: t.Number(),
    radius: t.Number(),
    angle: t.Number(),
    spread: t.Number(),
    x: t.Number(),
    y: t.Number(),
});

export const lightsRoutes = new Elysia({ prefix: '/lights' })
    .post('/', ({ body, set }) => {
        try {
            DB.insertLight(body);
            return { success: true, id: body.id };
        } catch (error) {
            set.status = 400;
            return { success: false, error: 'Failed to insert light' };
        }
    }, { body: lightBody })
    .put('/:id', ({ params: { id }, body, set }) => {
        try {
            DB.updateLight({ id, ...body });
            return { success: true };
        } catch (error) {
            set.status = 400;
            return { success: false, error: 'Failed to update light' };
        }
    }, { body: lightUpdateBody })
    .delete('/:id', ({ params: { id }, set }) => {
        try {
            DB.removeLight(id);
            return { success: true };
        } catch (error) {
            set.status = 400;
            return { success: false, error: 'Failed to delete light' };
        }
    });
