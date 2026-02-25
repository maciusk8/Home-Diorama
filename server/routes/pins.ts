import { Elysia } from 'elysia';
import * as DB from '../db/index';

export const pinsRoutes = new Elysia({ prefix: '/pins' })
    .get('/type/:typeId', ({ params: { typeId } }) => DB.getPinsByType(typeId))
    .post('/', ({ body }) => {
        const pin = body as any;
        DB.insertPin(pin);
        return { success: true, id: pin.id };
    })
    .put('/:id', ({ params: { id }, body }) => {
        // Wspieranie pełnej aktualizacji pinu oraz samej pozycji
        const payload = body as any;
        if (payload.roomId && payload.typeId) {
            const pin = { id, ...payload };
            DB.updatePin(pin);
        } else if (payload.x !== undefined && payload.y !== undefined) {
            DB.updatePinPosition(id, payload.x, payload.y);
        }
        return { success: true };
    })
    .delete('/:id', ({ params: { id } }) => {
        DB.removePin(id);
        return { success: true };
    });
