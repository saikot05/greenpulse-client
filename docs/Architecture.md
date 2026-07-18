# Frontend Architecture Specification

## 1. Core Framework & Engine
- **Next.js 16 (App Router) & React 19**: Powered by React Server Components (RSC) for optimized initial loads and dynamic Client Components for intense workspace interactions.
- **State Management & Data Fetching**: Utilizes TanStack Query (React Query) for smart server-state caching, automatic revalidation, and optimistic mutation UI flows, paired with React Context for lightweight notification and sidebar state.

## 2. Security & Access Control
- **Authentication**: Seamless client-side session handling and token validation integrated via Better Auth.
- **Route Guarding & Protection**: Enforced through middleware routing architecture (`proxy.ts`), mapping strict access layers for unauthenticated guests, facility managers, and environmental auditors.
- **Role-Based Access Control (RBAC)**: Dynamic UI rendering ensuring Auditors possess read-write privileges over active telemetry records, while Administrators maintain top-level tenant facility profiles.

## 3. Advanced Workspace Modules
- **Dynamic Audits Dashboard**: High-density grid display optimized for facility managers, utilizing case-insensitive metadata mappings to stream facility-specific architectural images and glassmorphic telemetry cards.
- **Carbon Telemetry Analyzer**: A drag-and-drop ingestion interface parsing industrial CSV/JSON streams, integrating live UI charts via Recharts, and flagging severe multi-x consumption anomalies.
- **Agentic AI Support Interface**: A premium chat terminal mimicking advanced LLM consoles, utilizing state-aware input controls, streaming text pipelines (SSE/WebSockets), and dynamic follow-up query chips.

## 4. UI/UX Design System & Layout Integrity
- **SaaS Glassmorphism & Styling**: Powered by Tailwind CSS with a strict emerald-green branding palette. Incorporates modern absolute radial mesh glows and fading SVG dot-matrix background graphics.
- **Layout Responsiveness & Guards**: Robust Flexbox and CSS Grid layers that gracefully downscale to single-column configurations on mobile screens. Wrapped with strict structural limits (`max-w-md`, `break-words`, `min-w-0`) to eliminate horizontal layout breaking.
- **Micro-Interactions & States**: Enhanced with card hover zoom transitions (`group-hover:scale-110`), frosted overlays, custom shimmer loading skeletons, and debounced text filters for instant lookup operations.

## 5. System Resilience & Performance
- **Error Boundaries**: Higher-Order React Error Boundaries wrapping layout sectors to capture client runtime exceptions without affecting the main dashboard view.
- **SEO & Data Streaming**: Fully optimized Next.js metadata API configuration injecting structured graphs into the document layout head.
- **API Services**: Intercepted HTTP clients communication targeting isolated Express.js endpoints under `/api/v1` with unified error mapping.
