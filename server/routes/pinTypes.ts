import { Elysia } from 'elysia';
import * as DB from '../db/index';

export const pinTypesRoutes = new Elysia({ prefix: '/pinTypes' })
    .get('/', () => DB.getPinTypes())
    .get('/:id', ({ params: { id } }) => DB.getPinTypeById(id));
