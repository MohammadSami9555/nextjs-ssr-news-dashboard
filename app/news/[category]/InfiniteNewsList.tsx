"use client";

import { useEffect, useState } from "react";

interface Article {
  title?: string;
  description?: string;
  url?: string;
  urlToImage?: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function InfiniteNewsList({
  initialArticles,
  category,
  country,
  search,
}: {
  initialArticles: Article[];
  category: string;
  country: string;
  search: string;
}) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [page, setPage] = useState(2);

  const [loading, setLoading] = useState(false);
  const [stop, setStop] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // prevents spam calls

  async function loadMore(): Promise<void> {
    if (loading || stop || isFetching) return;

    setLoading(true);
    setIsFetching(true);

    try {
      const res = await fetch(
        `/api/news?category=${category}&country=${country}&page=${page}&search=${search}`
      );

      const data = await res.json();

      if (!data?.articles?.length) {
        setStop(true);
      } else {
        setArticles((prev) => [...prev, ...data.articles]);
        setPage((p) => p + 1);
      }
    } catch (error) {
      console.error("Load error", error);
    }

    setLoading(false);
    setIsFetching(false);
  }

  // infinite scroll with debounce
  useEffect(() => {
    let timer: NodeJS.Timeout;

    function handleScroll(): void {
      clearTimeout(timer);

      timer = setTimeout(() => {
        if (
          window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300
        ) {
          loadMore();
        }
      }, 250);
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {articles.map((a, i) => (
          <div key={a.url ?? i} className="border rounded-xl shadow p-4">
            {a.urlToImage && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.urlToImage}
                  alt={a.title ?? "news image"}
                  className="rounded-lg"
                  onError={(
                    e: React.SyntheticEvent<HTMLImageElement, Event>
                  ) => {
                    (e.currentTarget as HTMLImageElement).src = "/fallback.jpg";
                  }}
                />
              </>
            )}

            <h3 className="font-semibold mt-2">{a.title}</h3>

            <p className="text-sm">{a.description ?? "No description"}</p>

            {a.url && (
              <a
                href={a.url}
                target="_blank"
                className="text-blue-600 underline text-sm"
              >
                Read more →
              </a>
            )}
          </div>
        ))}
      </div>

      {loading && <p className="text-center mt-4">Loading more…</p>}

      {stop && (
        <p className="text-center mt-4">
          No more articles available for this selection.
        </p>
      )}
    </>
  );
}
