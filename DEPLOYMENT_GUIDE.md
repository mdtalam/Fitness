# Deployment Guide: Fitness Tracker

This guide provides step-by-step instructions for deploying your reorganized project. We are using a **split-deployment strategy**:
- **Backend (API)**: Deployed to **Vercel**.
- **Frontend (UI)**: Deployed to **Firebase Hosting**.

---

## 1. Prerequisites

Ensure you have the following CLIs installed:
- **Vercel CLI**: `npm i -g vercel`
- **Firebase CLI**: `npm i -g firebase-tools`

---

## 2. Server Deployment (Vercel)

The server resides in the `server/` directory and is configured via `vercel.json`.

### Steps:
1.  **Navigate to the server directory**:
    ```bash
    cd server
    ```
2.  **Login to Vercel** (if not already):
    ```bash
    vercel login
    ```
3.  **Deploy**:
    ```bash
    vercel
    ```
    - Follow the prompts to create a new project.
    - **IMPORTANT**: When prompted for the "Link to existing project?", say **No**.
    - For "In which directory is your code located?", it should be `./`.
4.  **Configure Environment Variables**:
    Go to your [Vercel Dashboard](https://vercel.com/dashboard) and add the following keys to your project settings:
    - `MONGODB_URI`: Your MongoDB connection string.
    - `JWT_SECRET`: A long, secure random string.
    - `CLIENT_URL`: The URL of your Firebase app (you'll get this in the next step).
    - `NODE_ENV`: `production`
5.  **Get your API URL**:
    Once deployed, Vercel will provide a URL (e.g., `https://fitness-tracker-api.vercel.app`). **Copy this URL**.

---

## 3. Client Deployment (Firebase)

The client resides in the `client/` directory and is configured via `firebase.json`.

### Steps:
1.  **Navigate to the client directory**:
    ```bash
    cd client
    ```
2.  **Login to Firebase**:
    ```bash
    firebase login
    ```
3.  **Initialize/Select Project**:
    If you haven't created a Firebase project yet, do so at the [Firebase Console](https://console.firebase.google.com/).
    Then select your project ID:
    ```bash
    firebase use --add
    ```
4.  **Configure API URL**:
    Open `client/.env` and update `VITE_API_URL` with your Vercel URL (ensure it includes `/api` at the end):
    ```env
    VITE_API_URL=https://your-vercel-api-url.vercel.app/api
    ```
5.  **Build the project**:
    ```bash
    npm run build
    ```
    This creates the `dist/` folder.
6.  **Deploy**:
    ```bash
    firebase deploy --only hosting
    ```
7.  **Get your Frontend URL**:
    Firebase will provide a URL (e.g., `https://fitness-tracker.web.app`).

---

## 4. Final Verification

1.  **Update Server CORS**:
    Now that you have your Firebase URL, go back to the **Vercel Dashboard** and update the `CLIENT_URL` environment variable with your actual Firebase URL.
2.  **Redeploy Server**:
    Redeploy on Vercel to apply the new `CLIENT_URL` (or just trigger a new build).
3.  **Test**:
    Visit your Firebase URL and verify that the app loads and can communicate with the Vercel API.

---

> [!TIP]
> **Local Development**:
> You can still run both locally using:
> - `npm run dev:server` (Backend on 5000)
> - `npm run dev:client` (Frontend on 5173/5174/5175)
