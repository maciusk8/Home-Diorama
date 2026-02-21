import { useState } from "react";
import { Form } from "react-bootstrap";
import type { EntityState } from "@/shared/types/communication";
import { SidebarDraggableItem } from "@/features/dnd/components/SidebarDraggableItem";
export default function EntityDropdown({ entities }: { entities: EntityState[] }) {

    const [filter, setFilter] = useState('');

    const filtered = entities.filter(entity => {
        const name = (entity.attributes.friendly_name || entity.entity_id).toLowerCase();
        return !filter || name.includes(filter.toLowerCase());
    });

    return (
        <div className="entity-list">
            <Form.Control
                className="entity-list-filter"
                onChange={(e) => setFilter(e.target.value)}
                value={filter}
                placeholder="Filter entities..."
            />
            <div className="entity-list-items">
                {filtered.map(entity => (
                    <SidebarDraggableItem key={entity.entity_id} id={entity.entity_id} data={entity}>
                        <div
                            className="entity-list-item"
                            onClick={() => console.log(entity)}
                        >
                            {entity.attributes.friendly_name || entity.entity_id}
                        </div>
                    </SidebarDraggableItem>
                ))}
            </div>
        </div>
    );
}