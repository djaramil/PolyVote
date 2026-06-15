# PolyVote — Diagrams

Mermaid diagrams for the RSS-based PolyVote app. View in any Mermaid-capable Markdown
previewer.

---

## 1. Flow Diagrams

### 1a. System / Data Flow

```mermaid
flowchart LR
    subgraph External["External RSS Sources"]
        F1[Politics feed]
        F2[Tech feed]
        F3[Sports feed]
        F4[Business feed]
        F5[Entertainment feed]
        F6[Science feed]
    end

    subgraph Back4App["Back4App (Parse Server)"]
        JOB[["ingestFeeds<br/>Cloud Job (scheduled)"]]
        CF[["castVote / addComment<br/>Cloud Functions"]]
        DB[(Parse Database)]
    end

    subgraph Client["React + Vite Frontend"]
        UI[Feed / Topic UI]
        SDK[Parse JS SDK]
    end

    F1 & F2 & F3 & F4 & F5 & F6 -->|fetch + parse XML| JOB
    JOB -->|create Topic, de-dup by guid| DB
    UI --> SDK
    SDK -->|query Topics / Comments| DB
    SDK -->|castVote / addComment| CF
    CF -->|update counts| DB
    DB -->|results| SDK --> UI
```

### 1b. User Journey

```mermaid
flowchart TD
    A([Visit PolyVote]) --> B{Logged in?}
    B -- No --> C[Browse feed by category]
    C --> D{Try to vote or comment?}
    D -- Yes --> E[Prompt: Sign up / Log in]
    E --> F[Authenticated session]
    D -- No --> C
    B -- Yes --> F
    F --> G[Browse / filter by category]
    G --> H[Open topic detail]
    H --> I[Vote up / down]
    H --> J[Add comment]
    I --> K[Vote bar + counts update]
    J --> L[Comment appears in thread]
    K --> G
    L --> H
```

### 1c. RSS Ingestion Job

```mermaid
flowchart TD
    S([Scheduled trigger ~30 min]) --> Q[Query enabled Feed configs]
    Q --> LOOP{For each feed}
    LOOP --> FETCH[HTTP GET feed URL]
    FETCH --> OK{Fetch ok?}
    OK -- No --> LOG[Log error, skip feed]
    OK -- Yes --> PARSE[Parse RSS/XML items]
    PARSE --> ITEM{For each item}
    ITEM --> DUP{guid exists?}
    DUP -- Yes --> SKIP[Skip duplicate]
    DUP -- No --> CREATE[Create Topic<br/>map feed → category]
    CREATE --> ITEM
    SKIP --> ITEM
    ITEM --> LOOP
    LOOP --> PRUNE[Optional: prune old Topics]
    PRUNE --> DONE([Job complete])
    LOG --> LOOP
```

---

## 2. State Diagrams

### 2a. User's Vote on a Topic

```mermaid
stateDiagram-v2
    [*] --> NoVote
    NoVote --> Up: tap thumbs up
    NoVote --> Down: tap thumbs down
    Up --> Down: tap thumbs down
    Down --> Up: tap thumbs up
    Up --> NoVote: tap thumbs up again
    Down --> NoVote: tap thumbs down again
    note right of Up
        castVote(topicId, +1)
        upserts Vote, recomputes counts
    end note
```

### 2b. Authentication Session

```mermaid
stateDiagram-v2
    [*] --> Anonymous
    Anonymous --> Authenticating: submit login / signup
    Authenticating --> Authenticated: success (session token)
    Authenticating --> Anonymous: error
    Authenticated --> Anonymous: log out / session expired
    Authenticated --> [*]
```

### 2c. Topic Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Imported: created by ingestFeeds
    Imported --> Active: shown in feed
    Active --> Active: receives votes / comments
    Active --> Pruned: older than retention window
    Pruned --> [*]
```

---

## 3. Resource Diagram (Data Model)

```mermaid
erDiagram
    USER ||--o{ VOTE : casts
    USER ||--o{ COMMENT : writes
    TOPIC ||--o{ VOTE : receives
    TOPIC ||--o{ COMMENT : has
    FEED ||--o{ TOPIC : generates

    USER {
        string objectId PK
        string username
        string email
    }

    FEED {
        string objectId PK
        string url
        string sourceName
        string category
        boolean enabled
    }

    TOPIC {
        string objectId PK
        string title
        string description
        string category
        string sourceName
        string articleUrl
        string imageUrl
        string guid UK
        date publishedAt
        number upCount
        number downCount
        number commentCount
    }

    VOTE {
        string objectId PK
        pointer topic FK
        pointer user FK
        number value
    }

    COMMENT {
        string objectId PK
        pointer topic FK
        pointer author FK
        string body
    }
```

### Deployment / Resource Topology

```mermaid
flowchart TB
    subgraph Hosting["Static Hosting (Back4App Web Hosting / Netlify)"]
        SPA[PolyVote SPA<br/>React build]
    end

    subgraph B4A["Back4App"]
        PS[Parse Server REST/API]
        CC[Cloud Code: functions + ingestFeeds job]
        DBX[(MongoDB-backed<br/>Parse Database)]
        SCH[Job Scheduler]
    end

    NEWS[External RSS Feeds]

    User([Browser]) --> SPA
    SPA -->|Parse SDK| PS
    PS --> DBX
    CC --> DBX
    SCH --> CC
    CC -->|fetch| NEWS
```

---

## 4. Sequence Diagram — Casting a Vote

```mermaid
sequenceDiagram
    actor U as User
    participant UI as React UI
    participant SDK as Parse SDK
    participant CF as Cloud Function (castVote)
    participant DB as Parse DB

    U->>UI: tap thumbs up on a topic
    UI->>UI: optimistic UI update
    UI->>SDK: Parse.Cloud.run("castVote", {topicId, value:+1})
    SDK->>CF: request (with session token)
    CF->>DB: find existing Vote(user, topic)
    alt no existing vote
        CF->>DB: create Vote(value:+1)
    else vote exists & differs
        CF->>DB: update Vote.value
    else same value
        CF->>DB: delete Vote (toggle off)
    end
    CF->>DB: recompute upCount / downCount on Topic
    DB-->>CF: updated Topic
    CF-->>SDK: {upCount, downCount, myVote}
    SDK-->>UI: result
    UI->>U: reconcile vote bar with server truth
```

---

## 5. Frontend Component Hierarchy

```mermaid
flowchart TD
    APP[App] --> RT[Router]
    APP --> AUTHP[AuthProvider / context]
    RT --> LAYOUT[Layout: Navbar + Outlet]
    LAYOUT --> NAV[Navbar: logo, category links, auth buttons]
    LAYOUT --> FEED[FeedPage]
    LAYOUT --> DETAIL[TopicDetailPage]
    LAYOUT --> LOGIN[LoginPage]
    LAYOUT --> SIGNUP[SignupPage]

    FEED --> TABS[CategoryTabs]
    FEED --> SORT[SortControls]
    FEED --> GRID[TopicGrid]
    GRID --> CARD[TopicCard]
    CARD --> VB1[VoteBar]
    CARD --> VBTN1[VoteButtons]

    DETAIL --> HDR[TopicHeader + source link]
    DETAIL --> VB2[VoteBar]
    DETAIL --> VBTN2[VoteButtons]
    DETAIL --> CLIST[CommentList]
    DETAIL --> CFORM[CommentForm]
    CLIST --> CITEM[CommentItem]
```
