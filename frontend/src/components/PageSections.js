import { ArrowRight } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

// Har section 'type' ke hisab se render hota hai.
// Naya section-type add karna ho to: 1) yahan ek naya component banao, 2) SECTION_MAP mein register karo,
// 3) admin editor (create/edit page) mein uske form fields add karo.

function HeroSection({ data }) {
  const { heading, subheading, backgroundImage } = data;
  if (!heading && !subheading && !backgroundImage) return null;

  return (
    <section className="relative w-full bg-[#171717] py-10 sm:py-12">
      {backgroundImage && (
        <>
          <img
            src={backgroundImage}
            alt={heading || 'Banner'}
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-[#171717]/70" />
        </>
      )}
      <AnimatedSection>
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-3xl mx-auto">
          {subheading && (
            <span className="inline-block text-[11px] sm:text-xs tracking-[0.2em] uppercase text-white/60 font-medium mb-2 break-words">
              {subheading}
            </span>
          )}
          {heading && (
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white break-words">
              {heading}
            </h1>
          )}
        </div>
      </AnimatedSection>
    </section>
  );
}

function TextSection({ data }) {
  const { heading, body } = data;
  if (!heading && !body) return null;

  // "- " se shuru hone wali lines ko bullet list ki tarah treat karte hain,
  // baaki normal paragraph lines rehti hain (jaise screenshot mein hai).
  const lines = (body || '').split('\n').filter((l) => l.trim() !== '');
  const bulletLines = lines.filter((l) => l.trim().startsWith('- '));
  const paraLines = lines.filter((l) => !l.trim().startsWith('- '));

  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          {heading && (
            <h2 className="text-xl sm:text-2xl font-bold text-[#171717] mb-4 break-words">
              {heading}
            </h2>
          )}

          {paraLines.length > 0 && (
            <div className="space-y-3 mb-5">
              {paraLines.map((line, i) => (
                <p key={i} className="text-sm sm:text-base leading-relaxed text-[#4b4b4b] break-words">
                  {line}
                </p>
              ))}
            </div>
          )}

          {bulletLines.length > 0 && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
              {bulletLines.map((line, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-[#4b4b4b]">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#8a2e18] flex-shrink-0" />
                  <span className="break-words">{line.replace(/^-\s*/, '')}</span>
                </li>
              ))}
            </ul>
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
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="rounded-xl overflow-hidden border border-[#e8e8e8]">
            <img
              src={imageUrl}
              alt={caption || 'Section image'}
              className="w-full h-[220px] sm:h-[320px] object-cover"
            />
          </div>
          {caption && (
            <p className="text-center text-xs sm:text-sm text-[#8a8a8a] mt-3 break-words">
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
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {images.map((img, i) => (
            <AnimatedSection key={i}>
              <div className="aspect-square rounded-lg overflow-hidden border border-[#e8e8e8]">
                <img
                  src={img}
                  alt={`gallery-${i}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
    <section className="py-12 sm:py-16 bg-[#efefef]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <AnimatedSection>
          {heading && (
            <h2 className="text-xl sm:text-2xl font-bold text-[#171717] mb-6 break-words">
              {heading}
            </h2>
          )}
          {buttonText && buttonLink && (
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a
                href={buttonLink}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#171717] text-white font-semibold text-xs sm:text-sm uppercase tracking-wide hover:bg-black transition-colors"
              >
                {buttonText}
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
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