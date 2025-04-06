"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ArticleSummaryProps {
  articleSlug: string
}

export function ArticleSummary({ articleSlug }: ArticleSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const generateSummary = async () => {
    setIsLoading(true)

    // This is a placeholder for the actual API call that would be implemented later
    // In a real implementation, this would call an API endpoint that uses a model to generate a summary
    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Placeholder summary text
      setSummary(
        "This is a placeholder for the AI-generated summary. The actual summary generation functionality will be implemented later. The summary would provide a concise overview of the key points from the article, making it easier for readers to quickly understand the main ideas without reading the entire piece.",
      )
    } catch (error) {
      console.error("Error generating summary:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border rounded-lg p-6 bg-card">
      <h3 className="text-xl font-semibold mb-4">Article Summary</h3>

      {!summary && !isLoading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Generate an AI summary of this article</p>
          <Button onClick={generateSummary}>Generate Summary</Button>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Generating summary...</p>
        </div>
      )}

      {summary && !isLoading && (
        <div>
          <p className="text-muted-foreground mb-4">{summary}</p>
          <Button variant="outline" onClick={() => setSummary(null)} className="mt-2">
            Reset
          </Button>
        </div>
      )}
    </div>
  )
}
