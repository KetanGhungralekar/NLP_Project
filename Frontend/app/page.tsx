import { ArticleCard } from "@/components/article-card"
import { fetchTopHeadlines, transformNewsApiArticle } from "@/lib/api"
import { getArticles, setArticles, shouldRefreshCache } from "@/lib/articles"
import { Suspense } from "react"
import { ArticleCardSkeleton } from "@/components/article-card-skeleton"
import { FilterBar } from "@/components/filter-bar"

// This function fetches the latest news
async function getLatestNews(country = "us", category?: string) {
  try {
    if (shouldRefreshCache()) {
      const data = await fetchTopHeadlines({
        country,
        category: category === "all" ? undefined : category,
        pageSize: 12,
      })

      if (data.articles && Array.isArray(data.articles)) {
        const transformedArticles = data.articles.map(transformNewsApiArticle)
        setArticles(transformedArticles)
        return transformedArticles
      }
    }

    return getArticles()
  } catch (error) {
    console.error("Failed to fetch articles:", error)
    return getArticles() // Return cached or fallback articles
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { country?: string; category?: string }
}) {
  const country = searchParams.country || "us"
  const category = searchParams.category === "all" ? undefined : searchParams.category

  const articles = await getLatestNews(country, category)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Latest News</h1>

      <FilterBar />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <Suspense fallback={<ArticleSkeletons />}>
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </Suspense>
      </div>
    </div>
  )
}

function ArticleSkeletons() {
  return Array(6)
    .fill(null)
    .map((_, i) => <ArticleCardSkeleton key={i} />)
}

