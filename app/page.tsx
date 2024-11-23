import { UploadZone } from "@/components/upload-zone"
import { SiteHeader } from "@/components/site-header"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      
      <main className="flex-1">
        <section className="container px-4 py-12 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Analyze Vehicle Damage with AI
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Upload photos of vehicle damage and get instant AI-powered analysis and cost estimates.
            </p>
          </div>

          <div className="mt-12">
            <UploadZone />
          </div>
        </section>
      </main>
    </div>
  )
}