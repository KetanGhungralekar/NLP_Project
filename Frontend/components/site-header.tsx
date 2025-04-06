import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { SearchForm } from "@/components/search-form"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">NewsHub</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-foreground/80">
            Home
          </Link>
          <Link href="/category/technology" className="transition-colors hover:text-foreground/80">
            Technology
          </Link>
          <Link href="/category/science" className="transition-colors hover:text-foreground/80">
            Science
          </Link>
          <Link href="/category/health" className="transition-colors hover:text-foreground/80">
            Health
          </Link>
          <Link href="/category/business" className="transition-colors hover:text-foreground/80">
            Business
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <SearchForm />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

