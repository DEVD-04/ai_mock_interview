# AI Mock Interview Platform

A next-generation mock interview application powered by AI. This platform allows users to practice job interviews in real-time using voice interaction, receive instant feedback, and track their progress. It leverages **Google Gemini** for intelligence and **Vapi** for voice capabilities.

## 🚀 Features

  * **AI-Powered Question Generation**: Generates tailored interview questions based on job role, experience level, tech stack, and interview type (Behavioral/Technical).
  * **Real-Time Voice Interface**: Interactive voice-based interviews using Vapi.ai, providing a realistic conversational experience.
  * **Instant Feedback**: Analyzes interview transcripts using Google Gemini 2.0 Flash to provide detailed scores on communication, technical knowledge, problem-solving, and cultural fit.
  * **User Dashboard**: Track upcoming and past interviews with detailed performance analytics.
  * **Secure Authentication**: Full user management via Firebase Authentication with secure session management.

## 🛠️ Tech Stack

  * **Framework**: [Next.js 16+](https://nextjs.org/) (App Router)
  * **Language**: TypeScript
  * **Styling**: Tailwind CSS
  * **Database**: Firebase Firestore
  * **Authentication**: Firebase Auth (Client SDK + Admin SDK for sessions)
  * **AI Logic**: [Google Gemini](https://deepmind.google/technologies/gemini/) (via Vercel AI SDK)
  * **Voice AI**: [Vapi.ai](https://vapi.ai/)
  * **Validation**: Zod

## 🏁 Getting Started

### Prerequisites

  * Node.js 18+ installed.
  * A Firebase project set up.
  * A Vapi.ai account and public key.
  * A Google AI Studio API key (for Gemini).

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/your-username/ai-mock-interview.git
    cd ai_mock_interview
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Configuration**
    Create a `.env.local` file in the root directory.
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
    # Ensure private key is properly formatted
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

    # Firebase Client SDK (Client-side)
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

    Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

## 🏗️ Architecture Notes

This application follows a modern **Serverless** and **Edge-ready** architecture using Next.js App Router.

### 1\. Data Flow

  * **User Data**: Stored in Firebase Firestore (`users` collection).
  * **Interviews**: Metadata (role, tech stack, questions) is stored in the `interviews` collection.
  * **Feedback**: Generated post-interview and stored in the `feedback` collection, linked to the specific interview and user.

### 2\. AI Pipeline

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
      * **Google Gemini** processes the transcript against a rigorous Zod schema (Communication, Technical Knowledge, etc.) and returns structured JSON data.
      * This data is saved to Firestore for display.

## 💡 Design Decisions & Reasoning

### 1\. Server Actions for Data Mutation vs. API Routes

**Decision:** We utilized Next.js Server Actions (e.g., `createFeedback` in `auth.action.ts`) for the majority of data mutations rather than traditional API routes.
**Reasoning:**

  * **Type Safety:** Server Actions allow us to share TypeScript interfaces directly between the client and server without manually defining API response types.
  * **Reduced Latency:** By executing logic directly on the server closer to the database (Firebase Admin SDK), we reduce the round-trip overhead associated with separate HTTP requests.
  * **Simplification:** This removes the need for an intermediate API layer for internal app functions, keeping business logic co-located with the components that trigger it.

### 2\. Structured AI Output with Zod & Gemini 2.0 Flash

**Decision:** We employed the Vercel AI SDK's `generateObject` function combined with a strict **Zod schema** (`feedbackSchema`), utilizing the **Gemini 2.0 Flash** model.
**Reasoning:**

  * **Deterministic UI Rendering:** LLMs are non-deterministic by nature. By enforcing a Zod schema, we guarantee that the AI output matches the exact JSON structure required by our frontend components (charts, scorecards). This prevents "white screen of death" errors caused by malformed JSON.
  * **Model Selection:** `Gemini 2.0 Flash` was chosen over Pro or Ultra because feedback generation requires processing large context windows (entire interview transcripts) quickly. Flash provides the optimal balance of low latency (crucial for UX) and high reasoning capability for this specific classification task.

### 3\. Hybrid Authentication Strategy

**Decision:** We use the Firebase Client SDK for initial user interaction (Sign In/Up) and the Firebase Admin SDK for session management via HTTP-only cookies.
**Reasoning:**

  * **Security:** While client-side auth is fast, it is vulnerable to XSS. By exchanging the client token for a server-side session cookie (managed in `auth.action.ts`), we ensure that protected routes (like `/interview/[id]`) are verified securely on the server before rendering any sensitive data.
  * **Performance:** Server-side verification prevents the "flicker" effect often seen in client-only auth apps, where a user briefly sees a login screen before being redirected.

### 4\. Offloading Voice Processing to Vapi

**Decision:** Instead of building a custom STT (Speech-to-Text) and TTS (Text-to-Speech) pipeline using raw APIs (like OpenAI Whisper + TTS), we integrated Vapi.ai.
**Reasoning:**

  * **Latency Management:** Real-time conversation requires sub-500ms latency handling, which is incredibly difficult to engineer from scratch. Vapi handles endpointing (detecting when a user stops speaking) and interruption handling out-of-the-box.
  * **Focus on Core Logic:** This allowed us to focus our engineering efforts on the unique value proposition—the *content* of the interview and the *quality* of the feedback—rather than the infrastructure of voice transmission.

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

