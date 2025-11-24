# AI Mock Interview Platform

A next-generation mock interview application powered by AI. This platform allows users to practice job interviews in real-time using voice interaction, receive instant feedback, and track their progress. It leverages **Google Gemini** for intelligence and **Vapi** for voice capabilities.

## 🚀 Features

* **AI-Powered Question Generation**: Generates tailored interview questions based on job role, experience level, tech stack, and interview type (Behavioral/Technical).
* **Real-Time Voice Interface**: Interactive voice-based interviews using Vapi.ai, providing a realistic conversational experience.
* **Instant Feedback**: Analyzes interview transcripts using Google Gemini 2.0 Flash to provide detailed scores on communication, technical knowledge, problem-solving, and cultural fit.
* **User Dashboard**: Track upcoming and past interviews with detailed performance analytics.
* **Secure Authentication**: Full user management via Firebase Authentication.

## 🛠️ Tech Stack

* **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Database**: Firebase Firestore
* **Authentication**: Firebase Auth
* **AI Logic**: [Google Gemini](https://deepmind.google/technologies/gemini/) (via Vercel AI SDK)
* **Voice AI**: [Vapi.ai](https://vapi.ai/)
* **State Management**: React Hooks & Server Actions

## 🏁 Getting Started

### Prerequisites

* Node.js 18+ installed.
* A Firebase project set up.
* A Vapi.ai account and public key.
* A Google AI Studio API key (for Gemini).

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/ai-mock-interview.git](https://github.com/your-username/ai-mock-interview.git)
    cd ai_mock_interview
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Configuration**
    Create a `.env.local` file in the root directory and add the following variables.
    *Note: Replace the Firebase config values with those from your Firebase Console.*

    ```env
    # Vapi.ai Configuration
    NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_public_key
    NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_vapi_workflow_id

    # Google Gemini API
    GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key

    # Firebase Admin SDK (Server-side)
    FIREBASE_PROJECT_ID=your_project_id
    FIREBASE_CLIENT_EMAIL=your_client_email
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

    # Firebase Client SDK (Client-side)
    # You can typically find these in your Firebase project settings
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Architecture Notes

This application follows a modern **Serverless** and **Edge-ready** architecture using Next.js.

### 1. Data Flow
* **User Data**: Stored in Firebase Firestore (`users` collection).
* **Interviews**: Metadata (role, tech stack, questions) is stored in the `interviews` collection.
* **Feedback**: Generated post-interview and stored in the `feedback` collection, linked to the specific interview and user.

### 2. AI Pipeline
* **Interview Generation**:
    * The user inputs criteria (Role, Stack, Level).
    * Next.js API Route (`app/api/vapi/generate`) calls **Google Gemini** to generate a list of specific questions.
    * These questions are saved to Firestore and passed to the Vapi agent context.
* **Voice Interaction**:
    * The `Agent` component initializes the Vapi Web SDK.
    * It connects to a pre-configured Vapi Workflow/Assistant which acts as the interviewer voice.
    * Transcripts are captured in real-time.
* **Feedback Analysis**:
    * Upon interview completion, the transcript is sent via a Server Action (`createFeedback`).
    * **Google Gemini** processes the transcript against a rigorous schema (Communication, Technical Knowledge, etc.) and returns structured JSON data.
    * This data is saved to Firestore for display.

## 💡 Design Decisions

### Server Actions over API Routes
We heavily utilize **Next.js Server Actions** (`lib/actions/auth.action.ts`) for data mutations and fetching. This reduces client-side bundle size, ensures type safety between client and server, and simplifies the codebase by keeping logic co-located.

### Structured AI Output with Zod
To ensure the AI returns reliable data for the UI to render (e.g., charts, scorecards), we use the Vercel AI SDK's `generateObject` combined with **Zod schemas**. This forces the LLM (Gemini) to output strictly typed JSON, preventing UI crashes caused by hallucinated formats.

### Hybrid Auth Strategy
* **Client-Side**: Uses standard Firebase Auth SDK for immediate interaction and UI state updates.
* **Server-Side**: Uses `firebase-admin` to verify session cookies/tokens in Middleware or Server Components, ensuring secure access to protected routes (`/interview/*`).

## 📂 Folder Structure

* `app/`: Next.js App Router pages and layouts.
    * `(auth)/`: Authentication routes (sign-in, sign-up).
    * `(root)/`: Protected application routes (dashboard, interview).
* `components/`: Reusable UI components (shadcn/ui), forms, and the Vapi Agent.
* `firebase/`: Client and Admin SDK initialization.
* `lib/`: Utility functions and Server Actions.
    * `actions/`: Backend logic for Auth, DB, and AI.
    * `vapi.sdk.ts`: Vapi client configuration.
* `constants/`: Static data, Zod schemas, and prompt templates.
* `public/`: Static assets (images, icons).
