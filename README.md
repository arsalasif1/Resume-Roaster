<!-- <div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/820ad3de-0d45-40ee-a9e3-161365253a75

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev` -->

   # 🍖 Resume Roaster

> **Warning:** This app has zero filters and maximum sarcasm. Your feelings *will* be hurt. Your resume *will* be cooked. 🍳

## 🔥 What Is This?

**Resume Roaster** is a brutally honest AI-powered web app that tears your resume apart with savage critiques, dark humor, and actionable feedback. Built with [Google AI Studio](https://aistudio.google.com/) and the [Gemini API](https://ai.google.dev/), it's like having a senior FAANG recruiter roast your career choices at 3 AM.

Unlike polite resume reviewers that coddle you with "great job!", this app tells you the harsh truth: your bullet points are weak, your metrics are missing, and your "Microsoft Office" skill in 2026 is embarrassing.

## ⚡ Features

- **🔪 Savage AI Roasts**: Powered by Gemini 2.0 Flash with custom system instructions for maximum brutality
- **📄 PDF Upload**: Drop your resume, get roasted in <30 seconds
- **🎯 Specific Feedback**: Not just insults—actual actionable fixes for every roast
- **🚫 No Login Required**: Completely free, no account needed, no data stored
- **🌐 Open Source**: Built transparently, deployable by anyone
- **🎨 Clean UI**: Minimalist design that lets the roasts shine

## 🛠️ Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Google AI Studio (Gemini API)
- **Hosting**: Cloud Run (Starter Tier) / Vercel
- **File Processing**: PDF parsing with client-side extraction

## 🚀 How to Use

1. **Visit the App**: Go to ([https://ai.studio/apps/820ad3de-0d45-40ee-a9e3-161365253a75](https://ais-pre-lqd5agaxzjbore5klr6v4r-541935170945.asia-southeast1.run.app/)) (or run locally)
2. **Upload Resume**: Drag & drop your PDF (max 5MB)
3. **Get Roasted**: Watch as the AI dismantles your career narrative
4. **Fix & Repeat**: Implement the feedback, upload again, see if you survive round 2

## 💻 Local Development

```bash
# Clone the repo
git clone https://github.com/arsalasif1/Resume-Roaster.git
cd Resume-Roaster

# Install dependencies
npm install

# Add your Gemini API key
echo "GEMINI_API_KEY=your_key_here" > .env.local

# Run development server
npm run dev   
