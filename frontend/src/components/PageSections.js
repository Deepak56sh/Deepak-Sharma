import { ArrowRight } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

function HeroSection({ data }) {
  const { heading, subheading, backgroundImage } = data;
  if (!heading && !subheading && !backgroundImage) return null;

  return (
    <section className="relative w-full bg-[#14181d] overflow-hidden">
      {backgroundImage && (
        <>
          <img
            src={backgroundImage}
            alt={heading || 'Banner'}
            className="absolute inset-0 w-full h-full object-cover opacity-[0.18]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#14181d]/80 via-[#14181d]/90 to-[#14181d]" />
        </>
      )}
      <div className="relative w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-14 sm:py-20">
        <AnimatedSection>
          <div className="max-w-3xl">
            {subheading && (
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[2px] bg-[#a8632a]" />
                <span className="text-[11px] sm:text-xs text-[#c9a97a] font-medium break-words">
                  {subheading}
                </span>
              </div>
            )}
            {heading && (
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight break-words">
                {heading}
              </h1>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function TextSection({ data }) {
  const { heading, body } = data;
  if (!heading && !body) return null;

  const lines = (body || '').split('\n').filter((l) => l.trim() !== '');
  const bulletLines = lines.filter((l) => l.trim().startsWith('- '));
  const paraLines = lines.filter((l) => !l.trim().startsWith('- '));

  return (
    <section className="w-full bg-[#faf9f6] border-t border-[#e6e2da]">
      <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-14 sm:py-18">
        <AnimatedSection>
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-16">
            {heading && (
              <h2 className="text-xl sm:text-2xl font-bold text-[#21252b] leading-snug break-words lg:sticky lg:top-24 lg:self-start">
                {heading}
              </h2>
            )}

            <div className="max-w-2xl">
              {paraLines.length > 0 && (
                <div className="space-y-4 mb-6">
                  {paraLines.map((line, i) => (
                    <p
                      key={i}
                      className="text-sm sm:text-base leading-relaxed text-[#5b6169] break-words [overflow-wrap:anywhere] whitespace-pre-line"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              )}

              {bulletLines.length > 0 && (
                <ul className="space-y-3 border-t border-[#e6e2da] pt-5">
                  {bulletLines.map((line, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-[#3a3f45]">
                      <span className="mt-2 w-1.5 h-1.5 bg-[#a8632a] flex-shrink-0" />
                      <span className="break-words [overflow-wrap:anywhere]">{line.replace(/^-\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function ImageSection({ data }) {
  const { imageUrl, caption } = data;
  if (!imageUrl) return null;

  return (
    <section className="w-full bg-[#faf9f6]">
      <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-14">
        <AnimatedSection>
          <div className="relative">
            <span className="absolute -top-2.5 -left-2.5 w-6 h-6 border-t-2 border-l-2 border-[#a8632a] hidden sm:block" />
            <div className="w-full overflow-hidden border border-[#e6e2da]">
              <img
                src={imageUrl}
                alt={caption || 'Section image'}
                className="w-full h-[260px] sm:h-[420px] lg:h-[520px] object-cover"
              />
            </div>
          </div>
          {caption && (
            <p className="w-full text-xs sm:text-sm text-[#8a8f95] mt-3 break-words [overflow-wrap:anywhere] whitespace-pre-line">
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
    <section className="w-full bg-[#faf9f6] border-t border-[#e6e2da]">
      <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-14 sm:py-18">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-[#e6e2da] border border-[#e6e2da]">
          {images.map((img, i) => (
            <AnimatedSection key={i}>
              <div className="aspect-[4/3] overflow-hidden bg-[#faf9f6]">
                <img
                  src={img}
                  alt={`gallery-${i}`}
                  className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-500"
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
    <section className="w-full bg-[#14181d]">
      <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-14 sm:py-20">
        <AnimatedSection>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            {heading && (
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug break-words max-w-xl">
                {heading}
              </h2>
            )}
            {buttonText && buttonLink && (
              <a
                href={buttonLink}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#a8632a] text-white font-semibold text-sm hover:bg-[#8f5322] transition-colors flex-shrink-0 w-fit"
              >
                {buttonText}
                <ArrowRight className="w-4 h-4" />
              </a>
            )}
          </div>
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
    <div className="bg-[#faf9f6] w-full overflow-x-hidden">
      {sections.map((section, index) => {
        const Component = SECTION_MAP[section.type];
        if (!Component) return null;
        return <Component key={index} data={section.data || {}} />;
      })}
    </div>
  );
}