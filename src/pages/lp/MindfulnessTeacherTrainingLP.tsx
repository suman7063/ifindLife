import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import heroImg from '@/assets/lp/mtt-hero.jpg';
import gallery1 from '@/assets/lp/mtt-gallery-1.jpg';
import { CheckCircle, Calendar, MapPin, BadgeCheck, Users, Shield, Star } from 'lucide-react';

const features = [
  'Google 5-star rated training',
  'Free post‑training internship',
  'Professional platform to work on',
  'Experience a deeper state of meditation',
  'Non‑religious & practical training',
  'In‑built personal coaching',
  'Certified Meditation Master',
  'Lifetime access & support',
];

const traditions = [
  'Mindfulness',
  'Breathwork',
  '7 Chakra Healing Therapy',
  'Yoga Nidra Master Training',
  'Sufi',
  'Meditations from Lord Shiva',
  'Sound / Nada',
  'Nature – 5 Elements',
  'Happiness Module',
  'Buddhist',
  'Yogic',
  'Mantra',
];

const MindfulnessTeacherTrainingLP: React.FC = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Mindfulness Meditation Teacher Training (100/200 Hrs) + 300 Hrs Spiritual Coach Training',
    description:
      'Become a certified meditation master. Learn mindfulness, breathwork, chakra therapy, Yoga Nidra, sound healing and more with lifetime support and internship.',
    provider: {
      '@type': 'Organization',
      name: 'iFindlife',
      sameAs: 'https://ifindlife.com',
    },
  };

  return (
    <main className="bg-background text-foreground">
      <Helmet>
        <title>Mindfulness Meditation Teacher Training | iFindlife</title>
        <meta
          name="description"
          content="Become a certified meditation trainer. 100/200 hrs Mindfulness Teacher Training + 300 hrs Spiritual Coach Training by iFindlife. Practical, non‑religious, lifetime support."
        />
        <link rel="canonical" href={typeof window !== 'undefined' ? `${window.location.origin}/lp/mtt` : '/lp/mtt'} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={heroImg}
          alt="Mindfulness Meditation Teacher Training cohort"
          className="w-full h-[56vh] md:h-[68vh] object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0">
          <Container className="h-full flex flex-col justify-end pb-10 md:pb-14">
            <div className="max-w-3xl text-white">
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                Mindfulness Meditation Teacher Training in India
              </h1>
              <p className="mt-3 md:mt-4 text-white/90 text-base md:text-lg">
                100/200 Hrs Teacher Training + 300 Hrs Spiritual Coach Training. Become a certified meditation
                master with practical, non‑religious methods and lifetime support.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/user-signup">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Enroll Now</Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline">Talk to an Advisor</Button>
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-white/80 text-sm">
                <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4"/> Multiple intakes yearly</span>
                <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4"/> Rishikesh & Goa, India</span>
                <span className="inline-flex items-center gap-2"><Shield className="h-4 w-4"/> Certification Included</span>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="border-b bg-muted/40">
        <Container className="py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-primary"/> Google 5★ Rated</div>
          <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary"/> Global Alumni Community</div>
          <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary"/> Lifetime Support</div>
          <div className="flex items-center gap-2"><Star className="h-4 w-4 text-primary"/> Practical & Non‑religious</div>
        </Container>
      </section>

      {/* What makes it unique */}
      <section className="py-14">
        <Container>
          <header className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold">Why Choose This Training</h2>
            <p className="mt-2 text-muted-foreground">Highlights adapted from the reference program and aligned with iFindlife’s approach.</p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div key={f} className="rounded-xl border bg-card p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <p className="text-sm md:text-base">{f}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Traditions/Modules */}
      <section className="py-14 bg-muted/30">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold">What You Will Learn</h3>
              <p className="mt-2 text-muted-foreground">A multi‑tradition, experiential curriculum to help you teach with clarity and confidence.</p>
              <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {traditions.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-3">
                <Link to="#apply">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Apply Now</Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline">Ask a Question</Button>
                </Link>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg border">
              <img src={gallery1} alt="Meditation training group" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </Container>
      </section>

      {/* Outcomes */}
      <section className="py-14">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Teach with Confidence', desc: 'Gain a complete toolkit with scripts, session plans, and feedback to lead groups and 1:1 sessions.' },
              { title: 'Deep Personal Practice', desc: 'Experience profound states of meditation and develop a steady daily routine.' },
              { title: 'Career & Platform', desc: 'Get internship opportunities and be featured on iFindlife to begin serving clients.' },
            ].map((card) => (
              <article key={card.title} className="rounded-xl border bg-card p-6 shadow-sm">
                <h4 className="font-semibold text-lg">{card.title}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{card.desc}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section id="apply" className="py-16 bg-gradient-to-r from-ifind-purple/15 via-ifind-aqua/10 to-ifind-teal/15">
        <Container className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold">Ready to Become a Certified Meditation Trainer?</h3>
          <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
            Submit your application and a program advisor will help you finalize your intake, location and payment plan.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/user-signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">Apply & Enroll</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="px-8">Talk to an Advisor</Button>
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
};

export default MindfulnessTeacherTrainingLP;
