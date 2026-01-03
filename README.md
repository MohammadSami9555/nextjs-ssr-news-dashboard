# SSR News Dashboard – Next.js

This project is a **Server-Side Rendered (SSR) News Dashboard** built using **Next.js App Router**.  
It fetches live news using the News API and renders HTML on the server for **better SEO and personalization**.

---

## 🚀 Features

- ✔ Server-Side Rendering (SSR)
- ✔ Category filter (technology, sports, etc.)
- ✔ Country filter (IN, US, UK, etc.)
- ✔ Search functionality
- ✔ Pagination
- ✔ Tailwind responsive UI
- ✔ API key security via environment variables
- ✔ Error + Empty state handling UI
- ✔ SEO-friendly meta support

---

## 🧠 Why SSR?

SSR generates HTML **on the server for every request**.

### ✅ Benefits of SSR
- SEO optimized
- Fresh data every page load
- Personalized content per user
- Faster First Contentful Paint

### ⚠ Trade-offs of SSR
- More server processing
- Can be slower than cached CSR
- Higher API usage

---

## 🗂 Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- NewsAPI.org
- Vercel (optional deployment)

---

## 🔐 Environment Variables

Create `.env.local` file:

NEWS_API_KEY=your_news_api_key_here



---

## 🧾 Caching Strategy (Very Important for Marks)

export const revalidate = 0;
export const dynamic = "force-dynamic";

and

fetch(..., { cache: "no-store" })


✔ Forces **SSR on every request**  
✔ No stale cache  
✔ Real-time news updates

---

## 🛠 Error Handling

App does NOT crash if:

- API fails
- limit exceeded
- no results found

Instead, it shows:

No news found or API limit exceeded
Please try again later


---

## ▶ How to Run

npm install
npm run dev


Open:
http://localhost:3000/news/technology
