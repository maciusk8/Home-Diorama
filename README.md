# Home Assistant Diorama 

![HA Diorama](assets/HAdiorama.png)

> [!IMPORTANT]
> **Work In Progress (WIP)**
> The project is under active development. Some features may be subject to change.

## About The Project
Home Assistant Diorama is a web application that acts as an advanced client for Home Assistant. It allows visualizing and controlling smart home devices via an interactive room diorama. It was built with the idea of utilizing AI capabilities to transform photos of rooms into aesthetic diorama views. It features an interactive UI that allows mapping Home Assistant entities onto polygonal clickable areas, making smart home control highly intuitive and visually pleasing.

## Running the Application
To run the application locally, you first need to make sure you have [Bun](https://bun.sh/) installed via your system's package manager. Then, you simply need to execute the start script. It will automatically install dependencies, initialize the database (if necessary), and start both the backend and frontend servers:

```bash
./start.sh
```

The application will be accessible at `http://localhost:5173` (or another port specified by Vite).

## Home Assistant Integration
The project acts as an advanced client communicating directly with your Home Assistant instance using a WebSocket connection and a Long-Lived Access Token. No external cloud servers mediate this connection.

### Adding as a Custom Web Panel
It is highly recommended to add this application directly to your Home Assistant dashboard. To do this go to settings -> panels -> add panel and select "Webpage" as the type. Then paste the URL of the application in the URL field.
## Supported Entities
The system is built on a flexible pattern that matches the card's appearance and behavior to the device type.

Currently supported:
*   **Switches** 
*   **Lights** (with color/brightness visualization via CSS)

**Planned:**
*   Climate
*   Media Player
*   Covers
*   Sensors

It is incredibly easy to add new supported entities thanks to the `entityRegistry` and `abstractEntityCard`. This abstraction allows you to seamlessly introduce new device types without interfering with the main `RoomView`.

## Database Schema & Extensibility
The extensible architecture extends to the database layer. The database schema is specifically designed with maximum extensibility in mind, particularly regarding the addition of new light types or custom pins (pins that allow defining specific clickable areas). 

Because of this architectural decision, it will be fully possible in the future to add a complete home floor plan/schema on the main page, where these custom pins will represent different rooms and allow navigation between them.

## Directory Structure
```text
src/
├── components/         # UI Components
│   ├── DnD/            # Drag & Drop Logic (Maps, Pins)
│   ├── PopUps/         # Entity cards system and overlays
│   └── ...
├── hooks/              # Custom Hooks
│   ├── WebSocket/      # Connection logic (useAuth, useWebSocket)
│   └── Entities/       # Domain logic (useLights, useSwitches)
├── providers/          # React Context Providers (HomeAssistantProvider)
├── types/              # TypeScript type definitions
├── App.tsx             # Main layout and routing
└── main.tsx            # Entry point
```

## Tech Stack
*   **Frontend Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Backend Runtime:** [Bun](https://bun.sh/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Communication:** WebSocket - full bidirectional real-time communication.
*   **Styling:** Bootstrap 5 and **advanced CSS** for state visualizations (e.g., light glow, switch position).

---
