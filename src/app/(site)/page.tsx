import { getHomepage, getEngagementsForHomepage } from "../../../sanity/queries";
import { ModuleRenderer } from "@/components/ModuleRenderer";
import { GlobalEngagement } from "@/components/GlobalEngagement";
import Link from "next/link";

// Check for placeholder credentials (CI builds)
const isPlaceholder = () =>
  !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'placeholder';

export async function generateMetadata() {
  if (isPlaceholder()) {
    return {
      title: "MAISON - Curated Luxury",
      description: "Discover exceptional pieces curated for the discerning eye",
    };
  }

  const page = await getHomepage();

  return {
    title: page?.seo?.title || page?.title || "MAISON - Curated Luxury",
    description: page?.seo?.description || "Discover exceptional pieces curated for the discerning eye",
  };
}

export default async function Home() {
  // Skip data fetching when using placeholder credentials (CI builds)
  const [page, engagements] = isPlaceholder()
    ? [null, []]
    : await Promise.all([
        getHomepage(),
        getEngagementsForHomepage(),
      ]);

  // If no homepage is configured, show a setup message
  if (!page) {
    return (
      <>
        <GlobalEngagement engagements={engagements} />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-lg mx-auto px-4">
            <h1 className="display-lg mb-4">
              Welcome to <span className="text-gradient">MAISON</span>
            </h1>
            <p className="body-lg mb-8">
              No homepage has been configured yet. Go to the Sanity Studio to:
            </p>
            <ol className="text-left text-[var(--foreground-muted)] space-y-2 mb-8">
              <li>1. Create a new Page with your desired modules</li>
              <li>2. Go to Site Settings</li>
              <li>3. Select your page as the Homepage</li>
            </ol>
            <Link href="/studio" className="btn btn-primary">
              Open Sanity Studio
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <GlobalEngagement engagements={engagements} />
      <main>
        <ModuleRenderer modules={page.modules || []} />
      </main>
    </>
  );
}
