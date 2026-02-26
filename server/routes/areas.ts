import { Elysia, t } from 'elysia';
import * as DB from '../db/index';

const areaBody = t.Object({
    id: t.String(),
    roomPinId: t.String(),
    points: t.Array(t.Tuple([t.Number(), t.Number()])),
});

const areaUpdateBody = t.Object({
    points: t.Array(t.Tuple([t.Number(), t.Number()])),
});

export const areasRoutes = new Elysia({ prefix: '/areas' })
    .post('/', ({ body, set }) => {
        try {
            DB.insertArea(body);
            return { success: true, id: body.id };
        } catch (error) {
            set.status = 400;
            return { success: false, error: 'Failed to insert area' };
        }
    }, { body: areaBody })
    .put('/:id', ({ params: { id }, body, set }) => {
        try {
            DB.updateArea({ id, ...body });
            return { success: true };
        } catch (error) {
            set.status = 400;
            return { success: false, error: 'Failed to update area' };
        }
    }, { body: areaUpdateBody })
    .put('/by-pin/:pinId', ({ params: { pinId }, body, set }) => {
        try {
            DB.replaceAreaForPin(pinId, body.points);
            return { success: true };
        } catch (error) {
            set.status = 400;
            return { success: false, error: 'Failed to replace area' };
        }
    }, { body: areaUpdateBody })
    .delete('/:id', ({ params: { id }, set }) => {
        try {
            DB.removeArea(id);
            return { success: true };
        } catch (error) {
            set.status = 400;
            return { success: false, error: 'Failed to delete area' };
        }
    });
