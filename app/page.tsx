import Image from "next/image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Article {
  title?: string;
  description?: string;
  url?: string;
  urlToImage?: string;
}

const queryByCategory: Record<string, string> = {
  technology: "(technology OR AI OR gadgets OR programming)",
  sports: "(cricket OR football OR olympics OR tennis OR IPL)",
  business: "(business OR finance OR startup OR stock market)",
  health: "(health OR doctor OR medicine OR fitness)",
  science: "(science OR space OR NASA OR research)",
  entertainment: "(movies OR bollywood OR hollywood OR netflix)",
};

async function getNews(
  category: string,
  page: number,
  country: string,
  search: string
) {
  try {
    // search news
    if (search) {
      const res = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          search
        )}&language=en&pageSize=20&page=${page}&apiKey=${process.env.NEWS_API_KEY}`,
        { cache: "no-store" }
      );

      return await res.json();
    }

    // normal headlines
    const r1 = await fetch(
      `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pageSize=20&page=${page}&apiKey=${process.env.NEWS_API_KEY}`,
      { cache: "no-store" }
    );

    let data = await r1.json();

    // fallback if empty
    if (!data?.articles?.length) {
      const query = queryByCategory[category] ?? category;

      const r2 = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          query
        )}&language=en&pageSize=20&page=${page}&apiKey=${process.env.NEWS_API_KEY}`,
        { cache: "no-store" }
      );

      data = await r2.json();
    }

    return data;
  } catch (err) {
    return { articles: [] };
  }
}

export default async function NewsCategoryPage({
  params,
  searchParams,
}: {
  params?: { category?: string };
  searchParams?: { page?: string; country?: string; search?: string };
}) {
  const category = (params?.category ?? "technology").toLowerCase();
  const page = Number(searchParams?.page ?? "1");
  const country = searchParams?.country ?? "in";
  const search = searchParams?.search ?? "";

  const data = await getNews(category, page, country, search);
  const articles: Article[] = data?.articles ?? [];

  const categories = [
    "technology",
    "business",
    "sports",
    "health",
    "science",
    "entertainment",
  ];

  const countries = [
    { code: "in", name: "India" },
    { code: "us", name: "United States" },
    { code: "gb", name: "United Kingdom" },
    { code: "au", name: "Australia" },
    { code: "ca", name: "Canada" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 flex gap-2">
        📰 SSR News Dashboard
      </h1>

      <p className="mb-4">
        Category: <b>{category}</b> — Country: <b>{country.toUpperCase()}</b> — Page:{" "}
        <b>{page}</b>
      </p>

      {/* Search */}
      <form className="mb-4 flex gap-2">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search news e.g. AI, Cricket, Budget..."
          className="border px-3 py-2 rounded-lg w-80"
        />
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="page" value="1" />
        <button className="px-4 py-2 bg-black text-white rounded-lg">
          Search
        </button>
      </form>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap mb-4">
        {categories.map((c) => (
          <a
            key={c}
            href={`/news/${c}?country=${country}&search=${search}&page=1`}
            className={`px-3 py-1 rounded-full border ${
              c === category ? "bg-black text-white" : ""
            }`}
          >
            {c}
          </a>
        ))}
      </div>

      {/* Countries */}
      <div className="flex gap-2 flex-wrap mb-6">
        {countries.map((ct) => (
          <a
            key={ct.code}
            href={`/news/${category}?country=${ct.code}&search=${search}&page=1`}
            className={`px-3 py-1 rounded-full border ${
              ct.code === country ? "bg-blue-600 text-white" : ""
            }`}
          >
            {ct.name}
          </a>
        ))}
      </div>

      {/* ⭐⭐⭐ STEP–2 ERROR + EMPTY STATE UI ⭐⭐⭐ */}
      {(!articles || articles.length === 0) && (
        <div className="p-6 text-center border rounded-xl">
          <h2 className="text-xl font-semibold mb-2">
            No news found or API limit exceeded
          </h2>
          <p>Try changing search, category, or country. Please try again later.</p>
        </div>
      )}

      {/* News grid */}
      {articles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {articles.map((a, i) => (
            <div key={i} className="border rounded-xl shadow p-4">
              {a.urlToImage && (
                <Image
                  src={a.urlToImage}
                  width={500}
                  height={300}
                  alt="img"
                  className="rounded-lg object-cover"
                />
              )}

              <h3 className="font-semibold mt-2">{a.title}</h3>

              <p className="text-sm mt-1">{a.description ?? "No description"}</p>

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
      )}

      {/* Pagination */}
      <div className="flex gap-4 justify-center mt-8">
        {page > 1 && (
          <a
            className="px-4 py-2 border rounded-lg"
            href={`/news/${category}?country=${country}&search=${search}&page=${
              page - 1
            }`}
          >
            ← Previous
          </a>
        )}

        <span>Page {page}</span>

        <a
          className="px-4 py-2 border rounded-lg"
          href={`/news/${category}?country=${country}&search=${search}&page=${
            page + 1
          }`}
        >
          Next →
        </a>
      </div>
    </div>
  );
}
