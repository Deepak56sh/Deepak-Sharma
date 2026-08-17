'use client';
import { useState, useEffect } from 'react';
import { Leaf, CheckCircle, Award as AwardIcon } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

const defaultAboutData = {
  title: 'About Us',
  subtitle: 'Our Story',
  description1: '<p>Plantora was born out of a passion for plants and a mission to bring nature closer to every home. We believe plants make people happier, healthier and the better.</p>',
  description2: '',
  points: [
    'Handpicked Healthy Plants',
    'Expert Plant Care Guidance',
    'Sustainable & Eco-Friendly',
    'Happy Customer Support'
  ],
  stats: [
    { number: '10K+', label: 'Happy Customers' },
    { number: '50K+', label: 'Plants Delivered' },
    { number: '150+', label: 'Plant Varieties' },
    { number: '99%', label: 'Customer Satisfaction' }
  ],
  image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
  awards: [],
  teamMembers: []
};

export default function AboutPage() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch(`${API_URL}/about`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-cache'
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const result = await res.json();
        if (result.success && result.data) {
          setAboutData(result.data);
        } else {
          setAboutData(defaultAboutData);
        }
      } catch (err) {
        console.error(err);
        setAboutData(defaultAboutData);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div className="plant-store min-h-screen flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#2f9e44]"></div>
      </div>
    );
  }

  const data = aboutData || defaultAboutData;
  const awards = data.awards || [];
  const teamMembers = data.teamMembers || [];
  const points = data.points || defaultAboutData.points;

  return (
    <div className="plant-store bg-white w-full overflow-x-hidden">
      {/* ===== Hero / Story Section =====
          Desktop (lg+): image FLOATS RIGHT, jaisa pehle tha — text (title,
          subtitle, description) uske left/around flow karta hai.
          Agar text image se lamba ho jaaye, to CSS float ka natural behaviour
          hi use hota hai: text jahan tak image hai wahan tak uske left me
          rehta hai, aur image khatam hote hi baaki text apne aap FULL WIDTH
          me niche wrap ho jaata hai — layout kabhi tootega nahi.
          Mobile/tablet: image simple block ki tarah upar, text niche stack. */}
      <section className="py-10 sm:py-14 md:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Float container: lg:overflow-hidden is the classic "clearfix" —
              it makes this box's height include the floated image, so
              whatever comes after (points/stats) always starts cleanly below
              instead of overlapping the float. */}
          <div className="lg:[overflow:hidden]">
            <AnimatedSection>
              <div className="relative w-full sm:w-[80%] sm:mx-auto lg:w-[42%] lg:mx-0 lg:float-right lg:ml-10 mb-6 lg:mb-3">
                <div className="absolute -inset-4 bg-[#2f9e44]/10 rounded-3xl blur-2xl"></div>
                <img
                  src={data.teamImage || defaultAboutData.image}
                  alt="About Plantora"
                  className="relative rounded-3xl shadow-xl w-full h-[240px] xs:h-[280px] sm:h-[340px] lg:h-[420px] object-cover"
                  onError={(e) => {
                    e.target.src = defaultAboutData.image;
                  }}
                />
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="w-full min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#14261d] mb-2 break-words">
                  {data.title || 'About Us'}
                </h1>
                <h2 className="text-lg sm:text-xl font-semibold text-[#2f9e44] mb-4 break-words">
                  {data.subtitle || 'Our Story'}
                </h2>

                {/* Rich HTML content — wraps around the floated image, and
                    once it runs past the image's height it naturally
                    continues full-width. Never overflows on any screen. */}
                <div
                  className="ps-richtext text-base sm:text-lg leading-relaxed text-[#3f4a44] break-words [overflow-wrap:anywhere] whitespace-normal [&_p]:mb-3 [&_p:last-child]:mb-0 [&_img]:max-w-full [&_img]:h-auto [&_a]:break-all"
                  dangerouslySetInnerHTML={{ __html: data.description1 || defaultAboutData.description1 }}
                />
                {data.description2 && (
                  <div
                    className="ps-richtext text-base sm:text-lg leading-relaxed text-[#3f4a44] break-words [overflow-wrap:anywhere] whitespace-normal mt-4 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_img]:max-w-full [&_img]:h-auto [&_a]:break-all"
                    dangerouslySetInnerHTML={{ __html: data.description2 }}
                  />
                )}
              </div>
            </AnimatedSection>
          </div>

          {/* Points + Stats sit OUTSIDE the float container, so they always
              render full-width below the image, no matter how tall the
              description text or the image is. */}
          <AnimatedSection>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3 pt-8 sm:pt-10">
              {points.map((point, i) => (
                <li key={i} className="flex items-start sm:items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#eaf7ee] flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                    <CheckCircle className="w-4 h-4 text-[#2f9e44]" />
                  </div>
                  <span className="text-[#14261d] font-medium break-words min-w-0">{point}</span>
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 sm:pt-8">
              {(data.stats || defaultAboutData.stats).map((stat, i) => (
                <div
                  key={i}
                  className="text-center p-3 sm:p-4 bg-[#f6f8f7] rounded-2xl border border-[#e8ece9] min-w-0"
                >
                  <div className="text-xl sm:text-2xl font-bold text-[#2f9e44] break-words">{stat.number}</div>
                  <div className="text-xs text-[#6b7280] mt-1 leading-tight break-words">{stat.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== Awards Section ===== */}
      {awards.length > 0 && (
        <section className="py-10 sm:py-14 md:py-16 lg:py-20 bg-[#f6f8f7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="text-center mb-10 sm:mb-12">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#eaf7ee] mb-4">
                  <AwardIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#2f9e44]" />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#14261d] mb-2 break-words">
                  Awards & Recognition
                </h2>
                <p className="text-sm sm:text-base text-[#6b7280] max-w-xl mx-auto break-words px-2">
                  Honored for our commitment to quality and sustainable practices
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {awards.map((award, i) => (
                <AnimatedSection key={award._id || i}>
                  <div className="bg-white rounded-2xl border border-[#e8ece9] p-5 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow h-full">
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#f6f8f7]">
                      <img
                        src={award.image}
                        alt={award.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[#14261d] font-medium leading-snug break-words">
                      {award.title}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Team Members Section ===== */}
      {teamMembers.length > 0 && (
        <section className="py-10 sm:py-14 md:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="text-center mb-10 sm:mb-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#14261d] mb-2 break-words">
                  Meet Our Team
                </h2>
                <p className="text-sm sm:text-base text-[#6b7280] max-w-xl mx-auto break-words px-2">
                  The people behind every plant we grow and every order we deliver
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {teamMembers.map((member, i) => (
                <AnimatedSection key={member._id || i}>
                  <div className="text-center group min-w-0">
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 sm:mb-4 bg-[#f6f8f7]">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="text-[#14261d] font-semibold text-sm sm:text-base break-words">{member.name}</h3>
                    <p className="text-xs sm:text-sm text-[#2f9e44] break-words">{member.position}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}