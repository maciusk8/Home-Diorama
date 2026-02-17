# Home Assistant Custom Panel - Room Visualization

> [!IMPORTANT]
> **Work In Progress (WIP)**
> Projekt jest w fazie aktywnego rozwoju. Niektóre funkcjonalności mogą ulegać zmianom.

## O Projekcie (About Project)
Ten projekt to zaawansowany serwer klienta dla Home Assistant, który łączy się z backendem po tokenie użytkownika. Głównym założeniem jest wykorzystanie potencjału współczesnych modeli AI (generatywnej sztucznej inteligencji), które pozwalają w dokładny i estetyczny sposób przerabiać zdjęcia rzeczywistych pokoi na stylizowane widoki makietowe (maquette-like views).

Aplikacja zrywa z nudnym układem kafelkowym. Zamiast tego, "ożywia" wygenerowane przez AI wizualizacje, pozwalając na interakcję. Dzięki CSS i nakładkom, stan świateł czy przełączników jest wizualizowany bezpośrednio na grafice, a interfejs Drag & Drop pozwala na intuicyjne rozmieszczenie encji w przestrzeni wirtualnego pokoju.

## Architektura Systemu

Projekt działa jako zaawansowany klient, który komunikuje się bezpośrednio z Twoją instancją Home Assistant.

**Rekomendowane użycie:** Aplikacja powinna być dodana do Home Assistant jako `custom panel` typu `web application`.

### Stos Technologiczny
*   **Frontend Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Komunikacja:** WebSocket - pełna dwukierunkowa komunikacja w czasie rzeczywistym.
*   **Stylizacja:** Bootstrap 5 oraz **zaawansowany CSS** do wizualizacji stanów (np. poświata włączonego światła, pozycja przełącznika).

### Warstwa Komunikacji
Aplikacja utylizuje połączenie WebSocket, autoryzując się za pomocą Long-Lived Access Token użytkownika. Nie pośredniczy w tym żaden zewnętrzny serwer chmurowy – to bezpośrednie połączenie Klient <-> Twój Home Assistant.

### Warstwa Abstrakcji UI (Entity Cards & Overlays)
System oparty jest na elastycznym wzorcu, który dobiera wygląd i zachowanie karty do typu urządzenia.

Aktualnie obsługiwane:
*   **Switches** (Przełączniki)
*   **Lights** (Światła - z wizualizacją koloru/jasności przez CSS) (Wkrótce: pełna obsługa kolorów RGB)

**Planowane wkrótce:**
*   Klimatyzacja (Climate)
*   Odtwarzacze multimedialne (Media Player)
*   Rolety i żaluzje (Covers)
*   Czujniki parametrów (Sensors)

Abstrakcja ta pozwala na łatwe dodawanie nowych typów urządzeń (np. `light`, `climate`) bez ingerencji w główny widok `RoomView`.

### Struktura Katalogów
```
src/
├── components/         # Komponenty UI
│   ├── DnD/            # Logika Drag & Drop (Mapy, Piny)
│   ├── PopUps/         # System kart encji i overlaye
│   └── ...
├── hooks/              # Custom Hooks
│   ├── WebSocket/      # Logika połączeniowa (useAuth, useWebSocket)
│   └── Entities/       # Logika domenowa (useLights, useSwitches)
├── providers/          # React Context Providers (HomeAssistantProvider)
├── types/              # Definicje typów TypeScript
├── App.tsx             # Główny layout i routing
└── main.tsx            # Entry point
```

---
[English Version](./README_EN.md)
