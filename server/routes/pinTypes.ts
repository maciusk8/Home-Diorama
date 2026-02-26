import { Elysia } from 'elysia';
import * as DB from '../db/index';

export const pinTypesRoutes = new Elysia({ prefix: '/pinTypes' })
    .get('/', ({ set }) => {
        try {
            return DB.getPinTypes();
        } catch (error) {
            set.status = 500;
            return { success: false, error: 'Failed to fetch pin types' };
        }
    })
    .get('/:id', ({ params: { id }, set }) => {
        try {
            const pinType = DB.getPinTypeById(id);
            if (!pinType) {
                set.status = 404;
                return { success: false, error: 'Pin type not found' };
            }
            return pinType;
        } catch (error) {
            set.status = 500;
            return { success: false, error: 'Failed to fetch pin type' };
        }
    });
