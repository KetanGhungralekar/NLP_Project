export interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  category: string
  coverImage: string
  author: {
    name: string
    avatar: string
  }
  sources?: {
    name: string
    url: string
  }[]
}

import { sampleArticles } from "./api"

// Fallback articles in case the API fails
const fallbackArticles: Article[] = sampleArticles

// This will be populated with articles from the API
let cachedArticles: Article[] = [...fallbackArticles]
let lastFetchTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export function getArticles(): Article[] {
  return cachedArticles.length > 0 ? cachedArticles : fallbackArticles
}

export function getArticleBySlug(slug: string): Article | undefined {
  // First check cached articles
  const article = cachedArticles.find((article) => article.slug === slug)
  if (article) return article

  // Then check fallback articles if not found in cache
  return fallbackArticles.find((article) => article.slug === slug)
}

// Function to set articles from API
export function setArticles(articles: Article[]): void {
  // Merge new articles with sample articles to ensure we always have some content
  const existingSlugs = new Set(cachedArticles.map((article) => article.slug))

  // Add new articles that don't already exist in the cache
  const newArticles = articles.filter((article) => !existingSlugs.has(article.slug))

  // Combine existing sample articles with new articles
  cachedArticles = [...fallbackArticles, ...newArticles]
  lastFetchTime = Date.now()
}

// Check if we need to refresh the cache
export function shouldRefreshCache(): boolean {
  return Date.now() - lastFetchTime > CACHE_DURATION
}

// Add a specific article to the cache
export function addArticleToCache(article: Article): void {
  const existingIndex = cachedArticles.findIndex((a) => a.slug === article.slug)

  if (existingIndex >= 0) {
    // Update existing article
    cachedArticles[existingIndex] = article
  } else {
    // Add new article
    cachedArticles.push(article)
  }
}

