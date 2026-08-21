// Har section 'type' ke hisab se render hota hai.
// Naya section-type add karna ho to: 1) yahan ek naya component banao, 2) SECTION_MAP mein register karo,
// 3) admin editor (create/edit page) mein uske form fields add karo.

function HeroSection({ data }) {
  return (
    <section
      style={{
        padding: '80px 20px',
        textAlign: 'center',
        backgroundImage: data.backgroundImage ? `url(${data.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundColor: data.backgroundImage ? undefined : '#f0fdf4',
      }}
    >
      <h1 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '12px' }}>{data.heading}</h1>
      <p style={{ fontSize: '18px', color: '#444', maxWidth: '600px', margin: '0 auto' }}>
        {data.subheading}
      </p>
    </section>
  );
}

function TextSection({ data }) {
  return (
    <section style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      {data.heading && <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>{data.heading}</h2>}
      <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#333', whiteSpace: 'pre-line' }}>
        {data.body}
      </p>
    </section>
  );
}

function ImageSection({ data }) {
  return (
    <section style={{ padding: '20px', textAlign: 'center' }}>
      <img
        src={data.imageUrl}
        alt={data.caption || ''}
        style={{ maxWidth: '100%', borderRadius: '12px' }}
      />
      {data.caption && <p style={{ marginTop: '8px', color: '#666', fontSize: '14px' }}>{data.caption}</p>}
    </section>
  );
}

function GallerySection({ data }) {
  const images = data.images || [];
  return (
    <section style={{ padding: '40px 20px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`gallery-${i}`}
            style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '10px' }}
          />
        ))}
      </div>
    </section>
  );
}

function CtaSection({ data }) {
  return (
    <section style={{ padding: '60px 20px', textAlign: 'center', background: '#16a34a', color: '#fff' }}>
      <h2 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '10px' }}>{data.heading}</h2>
      {data.buttonText && data.buttonLink && (
        <a
          href={data.buttonLink}
          style={{
            display: 'inline-block',
            marginTop: '12px',
            padding: '12px 28px',
            background: '#fff',
            color: '#16a34a',
            borderRadius: '8px',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          {data.buttonText}
        </a>
      )}
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
  return (
    <>
      {sections.map((section, index) => {
        const Component = SECTION_MAP[section.type];
        if (!Component) return null;
        return <Component key={index} data={section.data || {}} />;
      })}
    </>
  );
}