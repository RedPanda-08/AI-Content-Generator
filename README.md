🤖 ContentAI: AI-Powered Content Command Center

ContentAI is a full-stack, AI-powered SaaS application designed to help social media managers and businesses streamline their content creation workflow. It acts as a strategic assistant that learns a user's unique brand voice and generates tailored, high-quality posts for various social media platforms.

The main generator interface, designed for a clean and intuitive user experience.

✨ Key Features
AI-Powered Content Generation: Leverages a powerful AI model to generate creative and relevant social media content from a simple prompt.

Personalized Brand Voice: Users can define their brand's unique tone, personality, and keywords, ensuring every piece of generated content is perfectly on-brand.

Secure User Authentication: A complete and secure system for users to sign up, log in, and manage their accounts, built with Supabase.

Content History: Automatically saves every generated piece of content to a user-specific history page, allowing for easy review and reuse.

Responsive & Modern UI: A sleek, collapsible, and mobile-friendly dashboard built with Tailwind CSS.

Protected Routes: Secure middleware ensures that only authenticated users can access the application's dashboard and features.

(Development) Mock API: Currently utilizes a mock API to ensure 100% uptime and stability for development and demonstration, perfectly simulating the AI's behavior.

🛠️ Tech Stack
Framework: Next.js (with App Router)

Language: TypeScript

Backend & Database: Supabase

Styling: Tailwind CSS

AI Model Integration: (Currently Mocked) API connection for Hugging Face, OpenAI, or Google Gemini.

UI Components: Lucide React (for icons), react-textarea-autosize.

🚀 Getting Started
Follow these instructions to set up and run the project on your local machine.

Prerequisites
Node.js (v18 or later)

npm or yarn

1. Clone the Repository
git clone [https://github.com/your-username/AI-Content-Generator.git](https://github.com/your-username/AI-Content-Generator.git)
cd contentgenerator

2. Install Dependencies
npm install

3. Set Up Environment Variables
You will need to create a .env.local file in the root of the project. Copy the contents of .env.example (if you have one) or create it from scratch.

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL='YOUR_SUPABASE_PROJECT_URL'
NEXT_PUBLIC_SUPABASE_ANON_KEY='YOUR_SUPABASE_ANON_KEY'

# API Key for the AI model (e.g., Hugging Face)
# This is not required while using the mock API
HUGGINGFACE_API_TOKEN='your_hf_token_here'
NOTE: We are using mock api just for testing. Will replace it with actual AI api soon :)

To get your Supabase credentials:

Go to your Supabase project dashboard.

Navigate to Project Settings > API.

You will find your Project URL and anon public key there.

4. Run the Development Server
npm run dev

Open http://localhost:3000 with your browser to see the result.

🔮 Future Work
--> Reconnect Live AI API: Replace the current mock API with a live connection to a service like OpenAI, Google Gemini, or a stable Hugging Face model once billing is set up.

--> Content Calendar: Implement a visual calendar where users can schedule their generated content.

