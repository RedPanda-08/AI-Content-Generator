# 🤖 ContentAI: AI-Powered Content Command Center

ContentAI is a full-stack, AI-powered SaaS application designed to help social media managers and businesses streamline their content creation workflow. It acts as a strategic assistant that learns a user's unique brand voice and generates tailored, high-quality posts for various social media platforms.

-----

## ✨ Key Features

  * **AI-Powered Content Generation:** Leverages **OpenAI's GPT-4o model** to generate creative and relevant social media content from a simple prompt.
  * **AI-Powered Content Analysis:** Get intelligent, actionable feedback on existing content to improve readability, engagement, and SEO alignment with your brand voice.
  * **Personalized Brand Voice:** Users can define their brand's unique tone, personality, and keywords, ensuring every piece of generated content is perfectly on-brand.
  * **Secure User Authentication:** A complete and secure system for users to sign up, log in, and manage their accounts, built with Supabase.
  * **Content History:** Automatically saves every generated piece of content to a user-specific history page, allowing for easy review and reuse.
  * **Protected Routes:** Secure middleware ensures that only authenticated users can access the application's dashboard and features.
  * **Responsive & Modern UI:** A sleek, collapsible, and mobile-friendly dashboard built with Tailwind CSS.

-----

## 🛠️ Tech Stack

  * **Framework:** Next.js (with App Router)
  * **Language:** TypeScript
  * **Backend & Database:** Supabase
  * **Styling:** Tailwind CSS
  * **AI Model:** OpenAI (GPT-4o)
  * **UI Components:** Lucide React (for icons), react-textarea-autosize

-----

## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

  * Node.js (v18 or later)
  * npm or yarn

### 1\. Clone the Repository

```bash
git clone https://github.com/your-username/contentgenerator.git
cd contentgenerator
```

### 2\. Install Dependencies

```bash
npm install
```

### 3\. Set Up Environment Variables

You will need to create a **`.env.local`** file in the root of the project. Copy the contents of `.env.example` (if you have one) or create it from scratch with the following variables:

```bash
# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL='YOUR_SUPABASE_PROJECT_URL'
NEXT_PUBLIC_SUPABASE_ANON_KEY='YOUR_SUPABASE_ANON_KEY'

# OpenAI API Key
OPENAI_API_KEY='sk-...'
```

**To get your Supabase credentials:**

1.  Go to your Supabase project dashboard.
2.  Navigate to **Project Settings** \> **API**.
3.  You will find your **Project URL** and **anon public** key there.

**To get your OpenAI API key:**

1.  Go to the [OpenAI Platform](https://platform.openai.com/) and log in.
2.  Navigate to the **API keys** section.
3.  Click **Create new secret key** and copy it.

### 4\. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

-----

## 🔮 Future Work

--> Usage-Based Limits: Introduce a credit system to manage API costs and limit the number of generations per user plan.
