import type { EntityState } from '../types/communication';

export default function Light({ light }: { light: EntityState }) {
    return (
        <div>
            <h2>Light: {light.attributes.friendly_name || light.entity_id}</h2>
        </div>
    );
}
