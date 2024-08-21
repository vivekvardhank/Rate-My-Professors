


# Rate My Professors RAG App

Flashcards-App is a SaaS (Software as a Service) application designed to generate AI-powered flashcards. The app leverages cutting-edge technologies such as Next.js, Clerk, Firebase, OpenAI, and Stripe to provide a seamless user experience. This was created as a group project created by Rabia Ghafoor, Bhavana Gupta, Adeel Sammer, and Vivek Vardhan.

# Join the Waitlist By Completing this form
https://tally.so/r/w7oa2A

## Features

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- OpenAI API Key 
- Pinecone API Key

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Rabia-Ghafoor/Rate-My-Professors.git
    ```

2. Navigate to the project directory:

    ```bash
    cd 
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

### Environment Setup

Create a `.env.local` file in the root directory and add your environment variables:

```plaintext
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id

NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key

NEXT_PUBLIC_CLERK_FRONTEND_API=your-clerk-frontend-api
CLERK_API_KEY=your-clerk-api-key

STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key


First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
