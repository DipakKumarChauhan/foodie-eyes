# Foodie Eyes - System Diagrams

This document contains detailed Mermaid diagrams for the Foodie Eyes application, including process flow and use case diagrams.

---

## 1. Process Flow Diagram - Search & Discovery Flow

This diagram shows the complete process flow from user query to displaying results.

```mermaid
flowchart TD
    Start([User Opens App]) --> CheckAuth{User Authenticated?}
    CheckAuth -->|No| ShowLocationModal[Show Location Modal]
    CheckAuth -->|Yes| LoadSavedLocation[Load Saved Location]
    
    ShowLocationModal --> GetLocation{Location Method}
    GetLocation -->|Manual Input| EnterLocation[User Enters Location]
    GetLocation -->|GPS| RequestGPS[Request GPS Permission]
    RequestGPS -->|Granted| GetCoordinates[Get Coordinates]
    GetCoordinates --> ReverseGeocode[Reverse Geocode to Address]
    ReverseGeocode --> SaveLocation[Save Location]
    EnterLocation --> SaveLocation
    LoadSavedLocation --> LocationSet[Location Set]
    SaveLocation --> LocationSet
    
    LocationSet --> ShowSearch[Show Search Interface]
    ShowSearch --> UserInput{User Input Method}
    
    UserInput -->|Text Input| TextQuery[User Types Query]
    UserInput -->|Voice Input| VoiceQuery[User Clicks Mic Button]
    UserInput -->|Mood Card| MoodQuery[User Selects Mood Card]
    
    VoiceQuery --> StartSpeechRec[Start Speech Recognition]
    StartSpeechRec -->|Permission?| SpeechError{Error?}
    SpeechError -->|Yes| ShowError[Show Permission Error]
    SpeechError -->|No| CaptureSpeech[Capture Speech]
    CaptureSpeech --> ConvertToText[Convert Speech to Text]
    ConvertToText --> TextQuery
    
    MoodQuery --> SetMoodPrompt[Set Mood Prompt as Query]
    SetMoodPrompt --> TextQuery
    
    TextQuery --> ApplyFilters{Apply Filters?}
    ApplyFilters -->|Yes| SetFilters[Set Dietary/Budget/Allergens]
    ApplyFilters -->|No| BuildQuery[Build Contextual Query]
    SetFilters --> BuildQuery
    
    BuildQuery --> ValidateQuery{Query Valid?}
    ValidateQuery -->|Empty| ShowEmptyError[Show Empty Query Error]
    ValidateQuery -->|No Location| ShowLocationError[Show Location Required Error]
    ValidateQuery -->|Valid| SendToAPI[POST /api/agent]
    
    SendToAPI --> Step1[STEP 1: Groq Query Refinement]
    Step1 --> ExtractBaseQuery[Extract Base Query<br/>Remove Filter Context]
    ExtractBaseQuery --> GroqValidate[Groq: Validate Food Intent]
    
    GroqValidate --> IsFood{Is Food Related?}
    IsFood -->|No| ReturnError[Return 400 Error<br/>Non-Food Rejection]
    IsFood -->|Yes| OptimizeQuery[Optimize Query<br/>Spell Check<br/>Cuisine Detection]
    
    OptimizeQuery --> ReappendFilters[Re-append Filter Context]
    ReappendFilters --> Step2[STEP 2: Serper Places Search]
    
    Step2 --> SearchPlaces[Search Google Maps Places<br/>via Serper API]
    SearchPlaces --> HasResults{Results Found?}
    
    HasResults -->|No| FallbackQuery[Try Fallback Query]
    FallbackQuery --> FallbackResults{Results?}
    FallbackResults -->|No| NoResults[Return Empty Results]
    FallbackResults -->|Yes| EnrichPlaces
    
    HasResults -->|Yes| CheckCuisine{Cuisine Detected?}
    CheckCuisine -->|Yes| CuisineExpansion[Expand Search:<br/>Search Cuisine Restaurants]
    CuisineExpansion --> MergeResults[Merge Cuisine Results]
    MergeResults --> EnrichPlaces[Enrich Place Details]
    CheckCuisine -->|No| EnrichPlaces
    
    EnrichPlaces --> GetDetails[Get Place Details<br/>Reviews, Snippets]
    GetDetails --> Step3[STEP 3: Smart Scoring]
    
    Step3 --> ScorePlaces[Score Each Place:<br/>- Cuisine Match +1000<br/>- Place Type Match +1500<br/>- Term Match Ratio +500<br/>- Rating +10]
    ScorePlaces --> SortByScore[Sort by Score<br/>Not Just Rating]
    SortByScore --> TopResults[Select Top 12 Results]
    
    TopResults --> Step4[STEP 4: Groq Analysis]
    Step4 --> AnalyzePlaces[Groq: Analyze Places<br/>Generate Tips & Match Reasons]
    AnalyzePlaces --> FormatResponse[Format Response]
    
    FormatResponse --> ReturnResults[Return Results to Frontend]
    ReturnError --> ShowErrorMsg[Show Error Message]
    NoResults --> ShowNoResults[Show No Results Message]
    
    ReturnResults --> DisplayResults[Display Results Cards]
    DisplayResults --> UserAction{User Action}
    
    UserAction -->|View Details| OpenDetailModal[Open Detail Modal]
    UserAction -->|Bookmark| CheckAuth2{Authenticated?}
    UserAction -->|Search Again| ShowSearch
    
    CheckAuth2 -->|No| ShowAuthModal[Show Auth Modal]
    CheckAuth2 -->|Yes| SaveBookmark[Save to Firestore]
    ShowAuthModal --> UserSignsIn[User Signs In]
    UserSignsIn --> SaveBookmark
    SaveBookmark --> UpdateUI[Update Bookmark UI]
    
    OpenDetailModal --> ShowDetails[Show Place Details:<br/>- Address & Map<br/>- Reviews<br/>- Contact Info<br/>- Famous Dishes]
    ShowDetails --> DetailActions{Detail Actions}
    DetailActions -->|Bookmark| CheckAuth2
    DetailActions -->|Share| SharePlace[Share on Social Media]
    DetailActions -->|Close| DisplayResults
    
    ShowErrorMsg --> ShowSearch
    ShowNoResults --> ShowSearch
    UpdateUI --> DisplayResults
    
    style Start fill:#e1f5ff
    style ReturnResults fill:#d4edda
    style ReturnError fill:#f8d7da
    style NoResults fill:#fff3cd
    style Step1 fill:#fff9e6
    style Step2 fill:#fff9e6
    style Step3 fill:#fff9e6
    style Step4 fill:#fff9e6
```

---

## 2. Use Case Diagram - System Actors & Use Cases

This diagram shows all actors and their interactions with the system.

```mermaid
graph TB
    User[👤 User<br/>Guest/Registered]
    System[🍔 Foodie Eyes System]
    Groq[🤖 Groq AI]
    Serper[🗺️ Serper API]
    Firebase[🔥 Firebase]
    Maps[📍 Google Maps]
    
    %% User Use Cases
    User -->|UC1: Set Location| System
    User -->|UC2: Search Food Places| System
    User -->|UC3: Use Voice Input| System
    User -->|UC4: Apply Filters| System
    User -->|UC5: View Place Details| System
    User -->|UC6: Bookmark Places| System
    User -->|UC7: View Bookmarks| System
    User -->|UC8: View Search History| System
    User -->|UC9: Share Places| System
    User -->|UC10: Sign In/Out| System
    User -->|UC11: Select Mood Cards| System
    User -->|UC12: Use Location Autocomplete| System
    
    %% System Internal Processes
    System -->|Validate Query| Groq
    System -->|Optimize Query| Groq
    System -->|Detect Cuisine| Groq
    System -->|Analyze Places| Groq
    System -->|Search Places| Serper
    System -->|Get Place Details| Serper
    System -->|Authenticate User| Firebase
    System -->|Save Bookmarks| Firebase
    System -->|Save History| Firebase
    System -->|Get User Data| Firebase
    System -->|Reverse Geocode| Maps
    System -->|Location Autocomplete| Maps
    
    %% Use Case Details
    UC1[UC1: Set Location<br/>- Manual Input<br/>- GPS Location<br/>- Autocomplete<br/>- Save Preference]
    UC2[UC2: Search Food Places<br/>- Text Query<br/>- Voice Query<br/>- Mood Selection<br/>- Filter Application]
    UC3[UC3: Use Voice Input<br/>- Start/Stop Recording<br/>- Speech to Text<br/>- Permission Handling]
    UC4[UC4: Apply Filters<br/>- Dietary Preferences<br/>- Budget Range<br/>- Allergen Avoidance]
    UC5[UC5: View Place Details<br/>- Full Information<br/>- Reviews & Ratings<br/>- Contact Details<br/>- Map Location]
    UC6[UC6: Bookmark Places<br/>- Add/Remove<br/>- Requires Auth<br/>- Persist to Cloud]
    UC7[UC7: View Bookmarks<br/>- List Saved Places<br/>- Quick Access<br/>- Remove Bookmarks]
    UC8[UC8: View Search History<br/>- Past Searches<br/>- Quick Re-search]
    UC9[UC9: Share Places<br/>- Social Media<br/>- Copy Link<br/>- WhatsApp/Telegram]
    UC10[UC10: Sign In/Out<br/>- Google Sign-In<br/>- Email/Password<br/>- Session Management]
    UC11[UC11: Select Mood Cards<br/>- Quick Search<br/>- Pre-defined Moods]
    UC12[UC12: Use Location Autocomplete<br/>- Real-time Suggestions<br/>- Address Selection]
    
    System -.->|Implements| UC1
    System -.->|Implements| UC2
    System -.->|Implements| UC3
    System -.->|Implements| UC4
    System -.->|Implements| UC5
    System -.->|Implements| UC6
    System -.->|Implements| UC7
    System -.->|Implements| UC8
    System -.->|Implements| UC9
    System -.->|Implements| UC10
    System -.->|Implements| UC11
    System -.->|Implements| UC12
    
    style User fill:#e1f5ff
    style System fill:#d4edda
    style Groq fill:#fff9e6
    style Serper fill:#fff9e6
    style Firebase fill:#fff9e6
    style Maps fill:#fff9e6
```

---

## 3. Detailed Search Process Flow

This diagram shows the detailed search algorithm with scoring and ranking.

```mermaid
flowchart TD
    Start([User Submits Query]) --> Extract[Extract Base Query<br/>Remove Filter Context]
    Extract --> Groq1[Groq: Food Intent Validation]
    
    Groq1 --> Valid{Valid Food Query?}
    Valid -->|No| Reject[Return 400 Error<br/>Non-Food Rejection]
    Valid -->|Yes| Optimize[Groq: Optimize Query<br/>- Spell Correction<br/>- Normalize Plurals<br/>- Detect Cuisine]
    
    Optimize --> Reappend[Re-append Filters<br/>Dietary/Budget/Allergens]
    Reappend --> Serper1[Serper: Initial Search<br/>Query + Location]
    
    Serper1 --> Results1{Results Found?}
    Results1 -->|No| Fallback[Groq: Generate Fallback Query]
    Fallback --> Serper2[Serper: Fallback Search]
    Serper2 --> Results2{Results Found?}
    Results2 -->|No| Empty[Return Empty Results]
    Results2 -->|Yes| CuisineCheck
    
    Results1 -->|Yes| CuisineCheck{Cuisine Detected?}
    CuisineCheck -->|Yes| CuisineSearch[Serper: Search Cuisine Restaurants<br/>e.g., 'South Indian restaurants']
    CuisineSearch --> Merge[Merge Results<br/>Remove Duplicates]
    Merge --> Enrich
    CuisineCheck -->|No| Enrich[Enrich Place Details<br/>- Get Reviews<br/>- Get Snippets<br/>- Get Categories]
    
    Enrich --> Scoring[Smart Scoring Algorithm]
    
    Scoring --> Score1[For Each Place:<br/>Initialize Score = 0]
    Score1 --> Score2[Cuisine Match?<br/>If Yes: +1000 points]
    Score2 --> Score3[Place Type Match?<br/>If Yes: +1500 points<br/>If No: -2000 points]
    Score3 --> Score4[Term Match Ratio<br/>Matching Terms / Total Terms<br/>Score += Ratio × 500]
    Score4 --> Score5[Rating Contribution<br/>Score += Rating × 10]
    
    Score5 --> Sort[Sort Places by Score<br/>Descending Order]
    Sort --> Top12[Select Top 12 Places]
    
    Top12 --> Groq2[Groq: Analyze Places<br/>Generate:<br/>- Match Reasons<br/>- Tips<br/>- Famous Dishes]
    Groq2 --> Format[Format Response<br/>- Add Context<br/>- Add Metadata]
    
    Format --> Return[Return to Frontend]
    Empty --> Return
    Reject --> Return
    
    Return --> Display[Display Results<br/>Sorted by Relevance]
    
    style Start fill:#e1f5ff
    style Return fill:#d4edda
    style Reject fill:#f8d7da
    style Empty fill:#fff3cd
    style Scoring fill:#e7f3ff
    style Groq1 fill:#fff9e6
    style Groq2 fill:#fff9e6
    style Serper1 fill:#fff9e6
    style Serper2 fill:#fff9e6
    style CuisineSearch fill:#fff9e6
```

---

## 4. Component Interaction Flow

This diagram shows how React components interact with each other.

```mermaid
sequenceDiagram
    participant User
    participant Home as Home Page
    participant TopBar as TopBar Component
    participant LocationDisplay as LocationDisplay
    participant MoodCards as MoodCards
    participant SearchHero as SearchHero Component
    participant DetailModal as DetailModal
    participant AuthModal as AuthModal
    participant API as /api/agent
    participant Groq as Groq AI
    participant Serper as Serper API
    participant Firebase as Firebase
    
    User->>Home: Opens Application
    Home->>Firebase: Check Auth Status
    Firebase-->>Home: Auth Status
    Home->>Home: Load Saved Location
    Home->>TopBar: Render with Location
    Home->>LocationDisplay: Render Location
    Home->>MoodCards: Render Mood Options
    Home->>SearchHero: Render Search Interface
    
    User->>SearchHero: Enters Query
    alt Voice Input
        User->>SearchHero: Clicks Mic Button
        SearchHero->>SearchHero: Start Speech Recognition
        SearchHero->>SearchHero: Convert Speech to Text
    end
    
    alt Apply Filters
        User->>SearchHero: Opens Filter Panel
        User->>SearchHero: Sets Dietary/Budget/Allergens
    end
    
    User->>SearchHero: Submits Search
    SearchHero->>API: POST /api/agent<br/>{query, location, filters}
    
    API->>Groq: Validate & Optimize Query
    Groq-->>API: {is_food, searchQuery, cuisineCategory}
    
    alt Not Food
        API-->>SearchHero: 400 Error
        SearchHero->>User: Show Error Message
    else Food Query
        API->>Serper: Search Places
        Serper-->>API: Places Array
        
        alt Cuisine Detected
            API->>Serper: Search Cuisine Restaurants
            Serper-->>API: Additional Places
            API->>API: Merge & Deduplicate
        end
        
        API->>Serper: Enrich Place Details
        Serper-->>API: Detailed Place Info
        
        API->>API: Smart Scoring & Ranking
        API->>Groq: Analyze Places
        Groq-->>API: Tips & Match Reasons
        
        API-->>SearchHero: Results Array
        SearchHero->>User: Display Results Cards
    end
    
    User->>SearchHero: Clicks Place Card
    SearchHero->>Home: onPlaceSelect(place)
    Home->>Firebase: Add to History
    Home->>DetailModal: Open with Place Data
    DetailModal->>User: Show Full Details
    
    alt Bookmark Action
        User->>DetailModal: Clicks Bookmark
        DetailModal->>Home: onBookmark(place)
        Home->>Home: Check Auth Status
        
        alt Not Authenticated
            Home->>AuthModal: Show Auth Modal
            User->>AuthModal: Signs In
            AuthModal->>Firebase: Authenticate
            Firebase-->>AuthModal: User Object
            AuthModal->>Home: Close Modal
        end
        
        Home->>Firebase: Save Bookmark
        Firebase-->>Home: Success
        Home->>DetailModal: Update Bookmark State
    end
    
    alt Share Action
        User->>DetailModal: Clicks Share
        DetailModal->>DetailModal: Generate Share URL
        DetailModal->>User: Show Share Options
    end
```

---

## 5. Data Flow Diagram

This diagram shows how data flows through the system.

```mermaid
flowchart LR
    subgraph "User Input Layer"
        TextInput[Text Input]
        VoiceInput[Voice Input]
        MoodCards[Mood Cards]
        Filters[Filters]
    end
    
    subgraph "Frontend Processing"
        SearchHero[SearchHero Component]
        QueryBuilder[Query Builder<br/>Contextual Query]
    end
    
    subgraph "API Layer"
        AgentAPI[/api/agent Route]
        QueryExtractor[Base Query Extractor]
    end
    
    subgraph "AI Processing"
        GroqValidate[Groq: Validate Intent]
        GroqOptimize[Groq: Optimize Query]
        GroqCuisine[Groq: Detect Cuisine]
        GroqAnalyze[Groq: Analyze Places]
    end
    
    subgraph "External APIs"
        SerperSearch[Serper: Search Places]
        SerperDetails[Serper: Get Details]
        MapsGeocode[Maps: Reverse Geocode]
    end
    
    subgraph "Data Processing"
        Scoring[Smart Scoring]
        Ranking[Ranking Algorithm]
        Filtering[Result Filtering]
    end
    
    subgraph "Storage"
        FirebaseAuth[Firebase: Auth]
        FirestoreBookmarks[Firestore: Bookmarks]
        FirestoreHistory[Firestore: History]
        LocalStorage[LocalStorage: Location]
    end
    
    subgraph "Output Layer"
        Results[Results Display]
        DetailModal[Detail Modal]
        Bookmarks[Bookmarks View]
        History[History View]
    end
    
    TextInput --> SearchHero
    VoiceInput --> SearchHero
    MoodCards --> SearchHero
    Filters --> SearchHero
    
    SearchHero --> QueryBuilder
    QueryBuilder --> AgentAPI
    
    AgentAPI --> QueryExtractor
    QueryExtractor --> GroqValidate
    GroqValidate --> GroqOptimize
    GroqOptimize --> GroqCuisine
    
    GroqCuisine --> SerperSearch
    SerperSearch --> SerperDetails
    SerperDetails --> Scoring
    Scoring --> Ranking
    Ranking --> Filtering
    Filtering --> GroqAnalyze
    GroqAnalyze --> Results
    
    Results --> DetailModal
    DetailModal --> FirebaseAuth
    FirebaseAuth --> FirestoreBookmarks
    FirestoreBookmarks --> Bookmarks
    
    SearchHero --> FirestoreHistory
    FirestoreHistory --> History
    
    SearchHero --> LocalStorage
    MapsGeocode --> LocalStorage
    
    style TextInput fill:#e1f5ff
    style VoiceInput fill:#e1f5ff
    style MoodCards fill:#e1f5ff
    style Filters fill:#e1f5ff
    style Results fill:#d4edda
    style DetailModal fill:#d4edda
    style Bookmarks fill:#d4edda
    style History fill:#d4edda
    style GroqValidate fill:#fff9e6
    style GroqOptimize fill:#fff9e6
    style GroqCuisine fill:#fff9e6
    style GroqAnalyze fill:#fff9e6
    style SerperSearch fill:#fff9e6
    style SerperDetails fill:#fff9e6
    style Scoring fill:#e7f3ff
    style Ranking fill:#e7f3ff
```

---

## 6. System Architecture Diagram

This diagram shows the overall system architecture.

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser<br/>Next.js App]
        Components[React Components]
        Hooks[Custom Hooks]
        Context[React Context]
    end
    
    subgraph "API Layer"
        NextAPI[Next.js API Routes]
        AgentRoute[/api/agent]
    end
    
    subgraph "AI Services"
        GroqService[Groq AI Service<br/>- Query Refinement<br/>- Cuisine Detection<br/>- Place Analysis]
    end
    
    subgraph "External Services"
        SerperAPI[Serper API<br/>Google Maps Places]
        MapsAPI[Google Maps API<br/>Geocoding]
        FirebaseService[Firebase<br/>- Authentication<br/>- Firestore]
    end
    
    subgraph "Data Processing"
        ScoringEngine[Scoring Engine<br/>- Cuisine Matching<br/>- Place Type Matching<br/>- Term Matching]
        RankingEngine[Ranking Engine<br/>- Score-based Sorting]
    end
    
    Browser --> Components
    Components --> Hooks
    Hooks --> Context
    Components --> NextAPI
    
    NextAPI --> AgentRoute
    AgentRoute --> GroqService
    AgentRoute --> SerperAPI
    AgentRoute --> ScoringEngine
    ScoringEngine --> RankingEngine
    RankingEngine --> AgentRoute
    
    Components --> FirebaseService
    Components --> MapsAPI
    
    GroqService -.->|API Calls| GroqService
    SerperAPI -.->|API Calls| SerperAPI
    FirebaseService -.->|API Calls| FirebaseService
    MapsAPI -.->|API Calls| MapsAPI
    
    style Browser fill:#e1f5ff
    style Components fill:#d4edda
    style AgentRoute fill:#fff9e6
    style GroqService fill:#fff9e6
    style SerperAPI fill:#fff9e6
    style FirebaseService fill:#fff9e6
    style ScoringEngine fill:#e7f3ff
    style RankingEngine fill:#e7f3ff
```

---

## How to Use These Diagrams

1. **Process Flow Diagram**: Use this to understand the complete search flow from user input to results display.

2. **Use Case Diagram**: Use this to understand all features and user interactions in the system.

3. **Detailed Search Process Flow**: Use this to understand the search algorithm, scoring, and ranking logic.

4. **Component Interaction Flow**: Use this to understand how React components communicate and interact.

5. **Data Flow Diagram**: Use this to understand how data moves through the system.

6. **System Architecture Diagram**: Use this to understand the overall system structure and technology stack.

### Rendering the Diagrams

You can render these Mermaid diagrams in:
- **GitHub**: Mermaid diagrams render automatically in `.md` files
- **VS Code**: Install "Markdown Preview Mermaid Support" extension
- **Online**: Use [Mermaid Live Editor](https://mermaid.live)
- **Documentation Sites**: Most modern documentation platforms support Mermaid

### Customization

Feel free to modify these diagrams to match your specific needs or add more details as the system evolves.
