import type { Article } from "./articles"

// API key should be stored in environment variables in production
const API_KEY = "aeb12c114d184649a640532a17e32792"
const BASE_URL = "https://newsapi.org/v2"

export async function fetchTopHeadlines(params: {
  country?: string
  category?: string
  q?: string
  pageSize?: number
  page?: number
}) {
  const searchParams = new URLSearchParams()

  // Add provided parameters to the query
  if (params.country) searchParams.append("country", params.country)
  if (params.category) searchParams.append("category", params.category)
  if (params.q) searchParams.append("q", params.q)
  if (params.pageSize) searchParams.append("pageSize", params.pageSize.toString())
  if (params.page) searchParams.append("page", params.page.toString())

  // Always add API key
  searchParams.append("apiKey", API_KEY)

  const url = `${BASE_URL}/top-headlines?${searchParams.toString()}`

  try {
    const response = await fetch(url, { cache: "no-store" })

    if (!response.ok) {
      throw new Error(`NewsAPI request failed: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching top headlines:", error)
    throw error
  }
}

export async function fetchEverything(params: {
  q?: string
  qInTitle?: string
  sources?: string
  domains?: string
  excludeDomains?: string
  from?: string
  to?: string
  language?: string
  sortBy?: "relevancy" | "popularity" | "publishedAt"
  pageSize?: number
  page?: number
}) {
  const searchParams = new URLSearchParams()

  // Add provided parameters to the query
  if (params.q) searchParams.append("q", params.q)
  if (params.qInTitle) searchParams.append("qInTitle", params.qInTitle)
  if (params.sources) searchParams.append("sources", params.sources)
  if (params.domains) searchParams.append("domains", params.domains)
  if (params.excludeDomains) searchParams.append("excludeDomains", params.excludeDomains)
  if (params.from) searchParams.append("from", params.from)
  if (params.to) searchParams.append("to", params.to)
  if (params.language) searchParams.append("language", params.language)
  if (params.sortBy) searchParams.append("sortBy", params.sortBy)
  if (params.pageSize) searchParams.append("pageSize", params.pageSize.toString())
  if (params.page) searchParams.append("page", params.page.toString())

  // Always add API key
  searchParams.append("apiKey", API_KEY)

  const url = `${BASE_URL}/everything?${searchParams.toString()}`

  try {
    const response = await fetch(url, { cache: "no-store" })

    if (!response.ok) {
      throw new Error(`NewsAPI request failed: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching everything:", error)
    throw error
  }
}

// Transform NewsAPI article to our Article format
export function transformNewsApiArticle(newsApiArticle: any): Article {
  // Generate a slug from the title
  const slug = newsApiArticle.title
    ? newsApiArticle.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 60)
    : `article-${Date.now()}`

  return {
    slug,
    title: newsApiArticle.title || "Untitled Article",
    excerpt: newsApiArticle.description || "",
    content: newsApiArticle.content || newsApiArticle.description || "",
    date: newsApiArticle.publishedAt || new Date().toISOString(),
    category: newsApiArticle.source?.name || "News",
    coverImage: newsApiArticle.urlToImage || "/placeholder.svg?height=800&width=1200",
    author: {
      name: newsApiArticle.author || "Unknown Author",
      avatar: "/placeholder-user.jpg",
    },
    sources: newsApiArticle.url
      ? [{ name: newsApiArticle.source?.name || "Source", url: newsApiArticle.url }]
      : undefined,
  }
}

// Function to fetch a specific article by title or keywords
export async function fetchArticleByKeywords(keywords: string): Promise<Article | null> {
  try {
    const data = await fetchEverything({
      q: keywords,
      pageSize: 1,
      sortBy: "relevancy",
    })

    if (data.articles && data.articles.length > 0) {
      return transformNewsApiArticle(data.articles[0])
    }

    return null
  } catch (error) {
    console.error("Error fetching article by keywords:", error)
    return null
  }
}

// Add some sample articles for testing
export const sampleArticles: Article[] = [
  {
    slug: "i-use-cursor-daily-heres-how-i-avoid-the-garbage-parts",
    title: "I Use Cursor Daily: Here's How I Avoid The Garbage Parts",
    excerpt:
      "Cursor is a popular code editor with AI capabilities. Here's how to make the most of it while avoiding its pitfalls.",
    content: `
      <p>Cursor has quickly become a popular code editor among developers due to its AI-powered features. However, like any tool, it has its strengths and weaknesses.</p>
      
      <h2>The Good Parts</h2>
      <p>Cursor's AI capabilities can significantly speed up coding by:</p>
      <ul>
        <li>Providing intelligent code completions</li>
        <li>Helping debug complex issues</li>
        <li>Generating boilerplate code</li>
        <li>Explaining unfamiliar code</li>
      </ul>
      
      <h2>The Not-So-Good Parts</h2>
      <p>However, there are some aspects that can be frustrating:</p>
      <ul>
        <li>Occasional incorrect suggestions</li>
        <li>Performance issues with large codebases</li>
        <li>Dependency on internet connection</li>
        <li>Privacy concerns with code being sent to AI services</li>
      </ul>
      
      <h2>How to Get the Most Out of Cursor</h2>
      <p>Here are some tips to maximize productivity while minimizing frustrations:</p>
      <ol>
        <li>Use AI suggestions as a starting point, not gospel</li>
        <li>Verify generated code before committing</li>
        <li>Disable AI features for sensitive projects</li>
        <li>Learn keyboard shortcuts to reduce reliance on AI for simple tasks</li>
        <li>Keep the editor updated for the latest improvements</li>
      </ol>
      
      <p>By being mindful of these practices, you can harness the power of Cursor's AI while avoiding its limitations.</p>
    `,
    date: "2023-04-05",
    category: "Technology",
    coverImage: "/placeholder.svg?height=800&width=1200",
    author: {
      name: "Tech Enthusiast",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    sources: [
      {
        name: "Cursor Documentation",
        url: "https://cursor.sh/docs",
      },
      {
        name: "Developer Blog",
        url: "https://example.com/cursor-review",
      },
    ],
  },
  {
    slug: "the-future-of-artificial-intelligence",
    title: "The Future of Artificial Intelligence: Opportunities and Challenges",
    excerpt: "Exploring how AI is reshaping industries and what challenges lie ahead for society and technology.",
    content: `
      <p>Artificial Intelligence (AI) continues to evolve at a rapid pace, transforming industries and creating new opportunities for innovation. From healthcare to finance, transportation to entertainment, AI technologies are reshaping how we work, live, and interact with the world around us.</p>
      
      <h2>The Current State of AI</h2>
      <p>Today's AI systems can perform complex tasks that once required human intelligence. Machine learning algorithms can analyze vast amounts of data to identify patterns and make predictions.</p>
      
      <h2>Opportunities</h2>
      <p>AI presents numerous opportunities across various sectors:</p>
      <ul>
        <li>Healthcare: Improved diagnostics and personalized treatment plans</li>
        <li>Transportation: Autonomous vehicles and optimized logistics</li>
        <li>Education: Personalized learning experiences</li>
        <li>Environment: Climate modeling and resource optimization</li>
      </ul>
      
      <h2>Challenges</h2>
      <p>However, the rise of AI also brings significant challenges:</p>
      <ul>
        <li>Ethical concerns about bias and fairness</li>
        <li>Job displacement and economic disruption</li>
        <li>Privacy and security risks</li>
        <li>Regulatory and governance questions</li>
      </ul>
      
      <p>As we navigate the future of AI, it will be crucial to balance innovation with responsible development and deployment.</p>
    `,
    date: "2023-11-15",
    category: "Technology",
    coverImage: "/placeholder.svg?height=800&width=1200",
    author: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    sources: [
      {
        name: "MIT Technology Review",
        url: "https://www.technologyreview.com/ai/",
      },
    ],
  },
]

