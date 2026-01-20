# Detailed System Architecture Diagram

## Overview

The **Detailed System Architecture Diagram** (Diagram 7) provides a comprehensive view of the Foodie Eyes application architecture, showing all layers, components, services, and their interactions.

## Resolution & Quality

- **PNG Format**: 7968 × 1706 pixels (Ultra High-Resolution)
- **SVG Format**: Vector graphics (infinitely scalable)
- **File Size**: PNG ~550 KB | SVG ~94 KB
- **Background**: White
- **Scale Factor**: 2x (for maximum clarity)

## Architecture Layers

### 1. 🌐 Client Layer - Next.js Frontend
- **Web Browser**: Chrome, Firefox, Safari, Edge
- **Framework**: Next.js 16.1.1 with React 19.2.3
- **Components**: TopBar, SearchHero, MoodCards, DetailModal, AuthModal, LocationModal
- **Custom Hooks**: useSpeechRecognition, useBookmarks, useHistory
- **Context**: AuthContext for global state management

### 2. 🔌 API Layer - Next.js API Routes
- **Main Endpoint**: `/api/agent` (POST method)
- **Purpose**: Server-side search processing and orchestration

### 3. 🤖 AI/ML Services Layer
- **Groq SDK**: LLM processing
- **Functions**:
  - `refineQuery`: Food intent validation, query optimization, spelling correction, cuisine detection
  - `analyzePlaces`: Place analysis, match reasons, tips generation, dish recommendations
  - `getFallbackQuery`: Alternative query generation

### 4. 🗺️ External APIs Layer
- **Serper API**: Google Maps Places search, place discovery, review snippets
- **Google Maps**: Geocoding, reverse geocoding, place data
- **OpenStreetMap (Nominatim)**: Location autocomplete, address lookup

### 5. 🔥 Firebase Services Layer
- **Firebase Authentication**: Google Sign-In, Email/Password, session management
- **Cloud Firestore**: 
  - `bookmarks` collection
  - `history` collection
  - `users` collection

### 6. 💾 Local Storage Layer
- **Browser LocalStorage**: Location preferences, session data
- **Client-side caching**: Temporary state management

### 7. ⚙️ Data Processing Layer
- **Scoring Engine**: Cuisine match scoring, place type matching, term match ratio, rating weighting
- **Ranking Engine**: Score-based sorting, relevance prioritization, top N selection
- **Filtering Engine**: Location filtering, cuisine expansion, duplicate removal

### 8. 🌍 Infrastructure & Deployment
- **Vercel Platform**: Hosting and deployment
- **CDN**: Content delivery network
- **Edge Functions**: Serverless function execution

## Data Flow

1. **User Input** → React Components → API Route
2. **API Route** → Groq AI (validation & optimization)
3. **API Route** → Serper API (place search)
4. **API Route** → Data Processing (scoring & ranking)
5. **API Route** → Groq AI (place analysis)
6. **Results** → React Components → User Display
7. **User Actions** → Firebase (bookmarks/history) or LocalStorage (preferences)

## Key Features Visualized

- ✅ Complete component hierarchy
- ✅ All API integrations
- ✅ Data flow paths
- ✅ Storage mechanisms
- ✅ Processing pipelines
- ✅ Infrastructure components

## Usage

- **Presentations**: Use PNG for slides (high resolution ensures clarity)
- **Documentation**: Use SVG for web pages (scalable)
- **Analysis**: Use MMD source for modifications
- **Print**: PNG at 7968×1706px is suitable for large format printing

## File Locations

- **Source**: `docs/diagrams-rendered/diagram-7-architecture.mmd`
- **PNG**: `docs/diagrams-rendered/diagram-7-architecture.png`
- **SVG**: `docs/diagrams-rendered/diagram-7-architecture.svg`
