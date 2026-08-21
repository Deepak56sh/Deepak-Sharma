import { notFound } from 'next/navigation';
import PageSections from '@/components/PageSections';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com';

async function getPage(slug) {
  try {
    const res = await fetch(`${API_URL}/api/pages/public/${slug}`, {
      // live site pe hamesha fresh data chahiye (page draft/active/delete turant reflect ho)
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error('Page fetch error:', err);
    return null;
  }
}

// Browser tab title + SEO ke liye
export async function generateMetadata({ params }) {
  const page = await getPage(params.slug);
  if (!page) return { title: 'Page not found' };
  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription || '',
  };
}

export default async function DynamicPage({ params }) {
  const page = await getPage(params.slug);

  // agar page hi nahi mila, ya draft hai (status active nahi hai) -> 404
  if (!page) {
    notFound();
  }

  return (
    <main>
      <PageSections sections={page.sections} />
    </main>
  );
}