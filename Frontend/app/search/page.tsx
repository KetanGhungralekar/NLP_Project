import { ArticleCard } from "@/components/article-card"
import { fetchEverything, transformNewsApiArticle } from "@/lib/api"
import { ArticleCardSkeleton } from "@/components/article-card-skeleton"
import { Suspense } from "react"
import { SearchFilters } from "@/components/search-filters"

interface SearchPageProps {
  searchParams: {
    q?: string
    language?: string
    sortBy?: string
    from?: string
    to?: string
  }
}

async function searchArticles(params: SearchPageProps["searchParams"]) {
  try {
    const { q, language, sortBy, from, to } = params

    if (!q) return []

    const data = await fetchEverything({
      q,
      language,
      sortBy: sortBy as "relevancy" | "popularity" | "publishedAt" | undefined,
      from,
      to,
      pageSize: 12,
    })

    if (data.articles && Array.isArray(data.articles)) {
      return data.articles.map(transformNewsApiArticle)
    }

    return []
  } catch (error) {
    console.error("Failed to search articles:", error)
    return []
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""
  const articles = query ? await searchArticles(searchParams) : []

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">Search Results</h1>
      <p className="text-muted-foreground mb-6">
        {query ? `Showing results for "${query}"` : "Enter a search term to find articles"}
      </p>

      <SearchFilters initialParams={searchParams} />

      {query && articles.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No articles found</h2>
          <p className="text-muted-foreground">Try a different search term or adjust your filters</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <Suspense fallback={<SearchSkeletons />}>
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </Suspense>
      </div>
    </div>
  )
}

function SearchSkeletons() {
  return Array(6)
    .fill(null)
    .map((_, i) => <ArticleCardSkeleton key={i} />)
}

