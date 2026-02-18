# Home Assistant Custom Panel - Room Visualization

> [!IMPORTANT]
> **Work In Progress (WIP)**
> This project is currently under active development. Some features may be subject to change.

## About the Project
This project is an advanced client server for Home Assistant that connects to the backend using a user token. The main concept utilizes the potential of modern AI models (generative artificial intelligence), which allow for the accurate and aesthetic transformation of real room photos into stylized maquette-like views.

The application breaks away from boring tile layouts. Instead, it "brings to life" the AI-generated visualizations, allowing for interaction. Thanks to CSS and overlays, the state of lights or switches is visualized directly on the graphic, and the Drag & Drop interface allows for intuitive placement of entities within the virtual room space.

## System Architecture

The project operates as an advanced client that communicates directly with your Home Assistant instance.

**Recommended Usage:** The application should be added to Home Assistant as a `custom panel` of type `web application`.

### Tech Stack
*   **Frontend Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Communication:** WebSocket - full bidirectional real-time communication.
*   **Styling:** Bootstrap 5 and **advanced CSS** for state visualization (e.g., glow of a light, switch position).

### Communication Layer
The application utilizes a WebSocket connection, authorizing via the user's Long-Lived Access Token. There is no external cloud server intermediary – this is a direct Client <-> Your Home Assistant connection.

### UI Abstraction Layer (Entity Cards & Overlays)
The system depends on a flexible pattern that selects the appearance and behavior of the card based on the device type.

Currently supported:
*   **Switches**
*   **Lights** (Visualized brightness/color via CSS) (Coming soon: full RGB support)

**Planned soon:**
*   Air Conditioning (Climate)
*   Media Players
*   Blinds and Covers
*   Sensor Parameters

This abstraction allows for easy addition of new device types (e.g., `light`, `climate`) without modifying the main `RoomView`.

### Directory Structure
```
src/
├── components/         # UI Components
│   ├── DnD/            # Drag & Drop Logic (Maps, Pins)
│   ├── PopUps/         # Entity Card System & Overlays
│   └── ...
├── hooks/              # Custom Hooks
│   ├── WebSocket/      # Connection Logic (useAuth, useWebSocket)
│   └── Entities/       # Domain Logic (useLights, useSwitches)
├── providers/          # React Context Providers (HomeAssistantProvider)
├── types/              # TypeScript Type Definitions
├── App.tsx             # Main Layout and Routing
└── main.tsx            # Entry point
```

---
[Polish Version](./README.md)
