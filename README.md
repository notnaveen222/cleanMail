# CleanMail ✨

CleanMail is a smart inbox productivity tool that connects to your Gmail, summarizes emails using GPT-4o Mini, and classifies them into categories — all on a clean, fast dashboard.

---

## 🚀 Features

- 🔐 Google Login (OAuth 2.0)
- 📥 Gmail API integration (Watch + Pub/Sub)
- 🤖 AI-powered email summarization using GPT-4o Mini
- 🏷️ Automatic classification into categories (e.g., Work, Promotions, Finance)
- 📊 Dashboard with filters, search, infinite scroll
- ✅ Mark emails as read/unread
- 🛠 Reclassify tags manually
- 💾 Supabase backend to store summaries + tags
- 📈 Usage quota (e.g., 1000 emails/month per user)

---

## 🛠 Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Shadcn
- **Backend:** Supabase (Database + Auth)
- **AI Layer:** GPT-4o Mini via OpenRouter
- **Email:** Gmail API + Pub/Sub (real-time updates)

---

## 🧠 How It Works

1. User logs in with Google
2. Gmail Watch API + Pub/Sub tracks new emails
3. Each new email is:
   - Fetched from Gmail
   - Summarized + classified using GPT-4o
   - Stored in Supabase (`summary + tag`)
4. Dashboard displays results with filters, search, and actions
