import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category") ?? "technology";
  const country = searchParams.get("country") ?? "in";
  const page = searchParams.get("page") ?? "1";
  const search = searchParams.get("search") ?? "";

  const url = search
    ? `https://newsapi.org/v2/everything?q=${search}&page=${page}&pageSize=20&apiKey=${process.env.NEWS_API_KEY}`
    : `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&page=${page}&pageSize=20&apiKey=${process.env.NEWS_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json(data);
}
