import { useState } from "react";
import { Form } from "react-bootstrap";
import type { EntityState } from "../types/communication";
import { SidebarDraggableItem } from "./SidebarDragableItem";
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
            <ul className="entity-list-items">
                {filtered.map(entity => (
                    <SidebarDraggableItem id={entity.entity_id} data={entity}>
                    <li
                        key={entity.entity_id}
                        className="entity-list-item"
                        onClick={() => console.log(entity)}
                    >
                        {entity.attributes.friendly_name || entity.entity_id}
                    </li>
                    </SidebarDraggableItem>
                ))}
            </ul>
        </div>
    );
}