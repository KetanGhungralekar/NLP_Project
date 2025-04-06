import Image from "next/image"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import type { Article } from "@/lib/articles"

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/article/${article.slug}`}>
        <div className="relative h-48 w-full">
          <Image
            src={article.coverImage || "/placeholder.svg?height=400&width=600"}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span className="font-medium text-primary">{article.category}</span>
          <span>•</span>
          <time dateTime={article.date}>{formatDate(article.date)}</time>
        </div>
        <Link href={`/article/${article.slug}`} className="hover:underline">
          <h2 className="text-xl font-bold mb-2 line-clamp-2">{article.title}</h2>
        </Link>
        <p className="text-muted-foreground line-clamp-3 mb-4">{article.excerpt}</p>
        <Link href={`/article/${article.slug}`} className="text-primary font-medium hover:underline">
          Read more
        </Link>
      </div>
    </div>
  )
}

