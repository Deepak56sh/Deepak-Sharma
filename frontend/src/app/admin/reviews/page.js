// 'use client';
// import { Star } from 'lucide-react';
// import PlaceholderPage from '@/components/admin/PlaceholderPage';

// export default function ReviewsPage() {
//   return (
//     <PlaceholderPage
//       icon={Star}
//       title="Reviews"
//       description="Moderate customer reviews and ratings."
//       primaryLabel="Add New"
//     />
//   );
// }

'use client';
// ✅ FIX: testimonials admin page lives at admin/reviews/testimonials/page.js
// (a subfolder of reviews itself) — not under admin/media.
import TestimonialsAdminPage from './testimonials/page';

export default function ReviewsPage() {
  return <TestimonialsAdminPage />;
}