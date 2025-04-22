# Notes AI App Workflow

## **Folder structure**:
├── app/
│   ├── layout.tsx                  # Common layout
│   ├── page.tsx                    # Redirect to /notes or login
│   ├── login/                      # Login page
│   │   └── page.tsx
│   ├── signup/                     # Signup page
│   │   └── page.tsx
│   ├── notes/
│   │   ├── page.tsx                # List + create note
│   │   └── [id]/page.tsx           # View/edit/summarize/delete note
│   └── api/
│       └── notes/
│           └── route.ts            # Handle note CRUD + summarization via Gemini
│
├── components/
│   ├── NoteForm.tsx                # Create/edit form
│   ├── NoteCard.tsx                # Single note preview
│   └── SummarizeButton.tsx         # Triggers Gemini summarization
│
├── lib/
│   ├── supabase.ts                 # Supabase client setup
│   ├── gemini.ts                   # Gemini API call wrapper
│   └── react-query.ts              # React Query client setup
│
├── types.ts                        # Shared TypeScript types
│
├── public/
├── styles/                         # Tailwind or custom overrides
├── .env.local                      # Supabase/Gemini keys etc.
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js

## **Routes**:
   - **'/'** Home.
   - **'/login'** Login page.
   - **'/signup'** Signup page.
   - **'/notes** Shows all the notes' list and has a "New Note" button.
   - **'/notes/new** For creating new note.
   - **'/notes/id** For seeing/editing/deleting specific notes.



## **How It Works**:
   - **Supabase** handles authentication, storing notes, and user-specific data.
   - **Styling** Uses TailwindCSS and Shadcn.
   - **React Query** manages fetching, updating, and caching notes.
   - **Gemini API** is used to summarize note content..
