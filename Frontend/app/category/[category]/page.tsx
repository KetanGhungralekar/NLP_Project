import { ArticleCard } from "@/components/article-card"
import { fetchTopHeadlines, transformNewsApiArticle } from "@/lib/api"
import { ArticleCardSkeleton } from "@/components/article-card-skeleton"
import { Suspense } from "react"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: { category: string }
}

// Valid categories according to NewsAPI
const validCategories = ["business", "entertainment", "general", "health", "science", "sports", "technology"]

async function getCategoryArticles(category: string) {
  try {
    const data = await fetchTopHeadlines({
      category,
      country: "us",
      pageSize: 12,
    })

    if (data.articles && Array.isArray(data.articles)) {
      return data.articles.map(transformNewsApiArticle)
    }

    return []
  } catch (error) {
    console.error(`Failed to fetch ${category} articles:`, error)
    return []
  }
}

export function generateStaticParams() {
  return validCategories.map((category) => ({
    category,
  }))
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params

  // Check if the category is valid
  if (!validCategories.includes(category)) {
    notFound()
  }

  const articles = await getCategoryArticles(category)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 capitalize">{category} News</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Suspense fallback={<CategorySkeletons />}>
          {articles.length > 0 ? (
            articles.map((article) => <ArticleCard key={article.slug} article={article} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <h2 className="text-2xl font-semibold mb-2">No articles found</h2>
              <p className="text-muted-foreground">
                No {category} articles are available at the moment. Please check back later.
              </p>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  )
}

function CategorySkeletons() {
  return Array(6)
    .fill(null)
    .map((_, i) => <ArticleCardSkeleton key={i} />)
}

