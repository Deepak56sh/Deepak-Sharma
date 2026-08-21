import { ArrowRight } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

// Har section 'type' ke hisab se render hota hai.
// Naya section-type add karna ho to: 1) yahan ek naya component banao, 2) SECTION_MAP mein register karo,
// 3) admin editor (create/edit page) mein uske form fields add karo.

function HeroSection({ data }) {
  const { heading, subheading, backgroundImage } = data;
  if (!heading && !subheading && !backgroundImage) return null;

  return (
    <section className="relative w-full min-h-[62vh] sm:min-h-[75vh] flex items-center justify-center overflow-hidden bg-[#14261d]">
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt={heading || 'Hero banner'}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1712] via-[#14261d]/70 to-[#14261d]/30" />

      <AnimatedSection>
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-3xl mx-auto">
          {subheading && (
            <span className="inline-block text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#a9e5b8] font-semibold mb-3 sm:mb-4 break-words">
              {subheading}
            </span>
          )}
          {heading && (
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight break-words">
              {heading}
            </h1>
          )}
        </div>
      </AnimatedSection>

      <div className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 w-6 h-9 sm:h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5">
        <span className="w-1 h-2 rounded-full bg-white/70 animate-bounce" />
      </div>
    </section>
  );
}

function TextSection({ data }) {
  const { heading, body } = data;
  if (!heading && !body) return null;

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          {heading && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#14261d] mb-4 sm:mb-5 break-words">
              {heading}
            </h2>
          )}
          {body && (
            <p className="text-base sm:text-lg leading-relaxed text-[#3f4a44] whitespace-pre-line break-words">
              {body}
            </p>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}

function ImageSection({ data }) {
  const { imageUrl, caption } = data;
  if (!imageUrl) return null;

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#f6f8f7]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
            <div className="absolute -inset-3 sm:-inset-4 bg-[#2f9e44]/10 rounded-3xl blur-2xl -z-10" />
            <img
              src={imageUrl}
              alt={caption || 'Section image'}
              className="w-full h-[220px] xs:h-[280px] sm:h-[380px] lg:h-[480px] object-cover"
            />
          </div>
          {caption && (
            <p className="text-center text-xs sm:text-sm text-[#6b7280] mt-3 sm:mt-4 break-words">
              {caption}
            </p>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}

function GallerySection({ data }) {
  const images = data.images || [];
  if (!images.length) return null;

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {images.map((img, i) => (
            <AnimatedSection key={i}>
              <div className="group relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[#f6f8f7] border border-[#e8ece9]">
                <img
                  src={img}
                  alt={`gallery-${i}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection({ data }) {
  const { heading, buttonText, buttonLink } = data;
  if (!heading && !buttonText) return null;

  return (
    <section className="relative py-14 sm:py-20 md:py-24 bg-[#14261d] overflow-hidden">
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#2f9e44]/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#2f9e44]/10 blur-3xl" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          {heading && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 break-words">
              {heading}
            </h2>
          )}
          {buttonText && buttonLink && (
            <a
              href={buttonLink}
              className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 rounded-full bg-[#2f9e44] text-white font-semibold text-sm sm:text-base hover:bg-[#278239] transition-colors"
            >
              {buttonText}
              <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}

const SECTION_MAP = {
  hero: HeroSection,
  text: TextSection,
  image: ImageSection,
  gallery: GallerySection,
  cta: CtaSection,
};

export default function PageSections({ sections = [] }) {
  if (!sections?.length) return null;

  return (
    <div className="bg-white w-full overflow-x-hidden">
      {sections.map((section, index) => {
        const Component = SECTION_MAP[section.type];
        if (!Component) return null;
        return <Component key={index} data={section.data || {}} />;
      })}
    </div>
  );
}