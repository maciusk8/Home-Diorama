import { Elysia, t } from 'elysia';
import * as DB from '../db/index';

const pinBody = t.Object({
    id: t.String(),
    roomId: t.String(),
    typeId: t.String(),
    x: t.Number(),
    y: t.Number(),
    customName: t.Optional(t.Nullable(t.String())),
});

const pinFullUpdateBody = t.Object({
    roomId: t.String(),
    typeId: t.String(),
    x: t.Number(),
    y: t.Number(),
    customName: t.Optional(t.Nullable(t.String())),
});

const pinPositionBody = t.Object({
    x: t.Number(),
    y: t.Number(),
});

export const pinsRoutes = new Elysia({ prefix: '/pins' })
    .post('/', ({ body, set }) => {
        try {
            DB.insertPin(body);
            return { success: true, id: body.id };
        } catch (error) {
            set.status = 400;
            return { success: false, error: 'Failed to insert pin' };
        }
    }, { body: pinBody })
    .put('/:id', ({ params: { id }, body, set }) => {
        try {
            DB.updatePin({ id, ...body });
            return { success: true };
        } catch (error) {
            set.status = 400;
            return { success: false, error: 'Failed to update pin' };
        }
    }, { body: pinFullUpdateBody })
    .patch('/:id/position', ({ params: { id }, body, set }) => {
        try {
            DB.updatePinPosition(id, body.x, body.y);
            return { success: true };
        } catch (error) {
            set.status = 400;
            return { success: false, error: 'Failed to update pin position' };
        }
    }, { body: pinPositionBody })
    .delete('/:id', ({ params: { id }, set }) => {
        try {
            DB.removePin(id);
            return { success: true };
        } catch (error) {
            set.status = 400;
            return { success: false, error: 'Failed to delete pin' };
        }
    });
