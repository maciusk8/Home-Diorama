import { Elysia } from 'elysia';

import { roomsRoutes } from './routes/rooms';
import { pinsRoutes } from './routes/pins';
import { lightsRoutes } from './routes/lights';
import { areasRoutes } from './routes/areas';
import { pinTypesRoutes } from './routes/pinTypes';
import { uploadsRoutes } from './routes/uploads';

const app = new Elysia()
  .use(uploadsRoutes)
  .group('/api/local', (api) => api
    .use(roomsRoutes)
    .use(pinsRoutes)
    .use(lightsRoutes)
    .use(areasRoutes)
    .use(pinTypesRoutes)
  )
  .listen(3000);

console.log(`Elysia backend server running on port ${app.server?.port}`);