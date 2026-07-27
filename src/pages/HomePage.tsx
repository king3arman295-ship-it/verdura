import { Link } from 'react-router-dom'
import {
  Leaf,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
  Droplets,
  Sprout,
  Flower2,
  Pill,
  MessageCircle,
  Star,
} from 'lucide-react'
import { WHATSAPP_NUMBER } from '../lib/env'

export default function HomePage() {
  const consultUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Hi Verdura, I would like to consult about organic remedies for my health needs.',
  )}`

  return (
    <div className="animate-fade-up">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sage-50 via-cream-50 to-sage-50/30 py-20 lg:py-28">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-sage-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-40 h-80 w-80 rounded-full bg-cream-200/70 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-cream-100/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-sage-800 shadow-sm backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-amber-500" />
                100% Pure & Organic Homeopathy
              </div>

              <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-sage-950 sm:text-5xl lg:text-6xl">
                Restoring natural balance through organic remedies.
              </h1>

              <p className="mt-5 text-lg leading-relaxed text-ink-600">
                At Verdura, we craft authentic, bio-dynamic homeopathic remedies prepared with care, purity, and scientific precision. Experience gentle healing designed to work in harmony with your body.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link to="/shop" className="btn-primary py-3.5 px-6 text-base shadow-pop">
                  Explore Remedy Shop
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#about"
                  className="btn-ghost py-3.5 px-6 text-base"
                >
                  Our Philosophy
                </a>
              </div>

              <div className="mt-10 flex items-center gap-6 border-t border-sage-200/60 pt-6">
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-ink-500">
                    <span className="font-semibold text-sage-900">4.9/5</span> from 500+ patient reviews
                  </p>
                </div>
                <div className="h-8 w-px bg-sage-200" />
                <div className="flex items-center gap-2 text-xs font-medium text-sage-800">
                  <ShieldCheck className="h-5 w-5 text-sage-600" />
                  Practitioner Certified Quality
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-3xl border border-sage-200/80 bg-cream-100 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1618130070080-91f4d55a2383?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGhlcmJzfGVufDB8fDB8fHww"
                  alt="Medicinal Homeopathic Herbs & Tinctures"
                  className="h-full w-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  width={600}
                  height={450}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sage-950/40 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-cream-50/90 p-4 shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-600 text-cream-50">
                      <Leaf className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-semibold text-sage-900">
                        Zero Synthetic Chemicals
                      </h4>
                      <p className="text-xs text-ink-500">
                        Hand-selected natural botanicals & minerals
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="scroll-mt-20 py-20 bg-cream-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-sage-100 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-sage-700">
              <HeartHandshake className="h-3.5 w-3.5" /> About Verdura
            </div>
            <h2 className="mt-4 font-display text-3xl font-semibold text-sage-900 sm:text-4xl">
              Rooted in nature, backed by homeopathic tradition.
            </h2>
            <p className="mt-4 text-lg text-ink-600 leading-relaxed">
              Verdura was founded with a singular purpose: to deliver pure, unadulterated organic remedies that honor classic homeopathic principles while adhering to the modern standards of quality and safety.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <div className="card p-8 transition-transform duration-300 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-100 text-sage-700">
                <Sprout className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-sage-900">
                100% Organic Sourcing
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                We partner exclusively with certified organic growers and wildcrafters to source botanicals free from pesticides, heavy metals, or chemical additives.
              </p>
            </div>

            <div className="card p-8 transition-transform duration-300 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-100 text-sage-700">
                <Droplets className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-sage-900">
                Mindful Potentization
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Every remedy is prepared through meticulous serial dilution and succussion in purist laboratory conditions to ensure optimal biological potency.
              </p>
            </div>

            <div className="card p-8 transition-transform duration-300 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-100 text-sage-700">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-sage-900">
                Individualized Wellness
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Homeopathy treats the whole person, not just symptoms. We offer guidance to help you select remedies matched to your unique vitality.
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-3xl bg-sage-900 p-8 text-cream-50 sm:p-12 shadow-xl">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <h3 className="font-display text-2xl font-semibold text-cream-50 sm:text-3xl">
                  Our Promise of Purity & Excellence
                </h3>
                <p className="mt-4 text-sage-200 leading-relaxed text-sm sm:text-base">
                  Whether you are seeking natural relief for seasonal stress, digestive harmony, skin health, or immune resilience, Verdura provides safe remedies suitable for all ages.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-3 text-sm font-medium text-cream-100">
                    <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
                    Non-habit forming, non-drowsy natural formulas
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-cream-100">
                    <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
                    Cruelty-free & sustainably packaged in amber glass
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-cream-100">
                    <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
                    Direct practitioner access via WhatsApp ordering
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="rounded-2xl bg-sage-800/80 p-6 border border-sage-700/50">
                  <span className="font-display text-3xl font-bold text-amber-400">100%</span>
                  <p className="mt-1 text-xs text-sage-200 font-medium">Organic Botanical Ingredients</p>
                </div>
                <div className="rounded-2xl bg-sage-800/80 p-6 border border-sage-700/50">
                  <span className="font-display text-3xl font-bold text-amber-400">0%</span>
                  <p className="mt-1 text-xs text-sage-200 font-medium">Synthetic Preservatives</p>
                </div>
                <div className="rounded-2xl bg-sage-800/80 p-6 border border-sage-700/50">
                  <span className="font-display text-3xl font-bold text-amber-400">15+</span>
                  <p className="mt-1 text-xs text-sage-200 font-medium">Years Practical Expertise</p>
                </div>
                <div className="rounded-2xl bg-sage-800/80 p-6 border border-sage-700/50">
                  <span className="font-display text-3xl font-bold text-amber-400">24/7</span>
                  <p className="mt-1 text-xs text-sage-200 font-medium">WhatsApp Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Organic Remedies Section */}
      <section id="remedies" className="scroll-mt-20 py-20 bg-gradient-to-b from-sage-50/50 to-cream-50 border-t border-sage-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-sage-100 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-sage-700">
                <Flower2 className="h-3.5 w-3.5" /> Remedy Categories
              </div>
              <h2 className="mt-4 font-display text-3xl font-semibold text-sage-900 sm:text-4xl">
                Our Organic Remedy Formulations
              </h2>
              <p className="mt-3 text-ink-600">
                Carefully potentized and formulated remedies tailored for specific holistic wellness needs.
              </p>
            </div>
            <Link
              to="/shop"
              className="mt-6 md:mt-0 btn-primary self-start md:self-auto py-3 px-6"
            >
              Browse All Items in Shop
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card p-6 border border-sage-200/80 bg-cream-50 hover:border-sage-400 transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-100 text-sage-700">
                <Pill className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-sage-900">
                Homeopathic Pellets
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-500">
                Sucrose-lactose free organic pellets infused with active botanical attenuations for fast oral absorption.
              </p>
              <Link to="/shop" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-sage-700 hover:text-sage-900">
                View in Shop &rarr;
              </Link>
            </div>

            <div className="card p-6 border border-sage-200/80 bg-cream-50 hover:border-sage-400 transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-100 text-sage-700">
                <Droplets className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-sage-900">
                Mother Tinctures
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-500">
                Cold-pressed, concentrated organic plant extracts crafted in small batches for maximum bio-availability.
              </p>
              <Link to="/shop" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-sage-700 hover:text-sage-900">
                View in Shop &rarr;
              </Link>
            </div>

            <div className="card p-6 border border-sage-200/80 bg-cream-50 hover:border-sage-400 transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-100 text-sage-700">
                <Sparkles className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-sage-900">
                Immunity & Vitality
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-500">
                Gentle immune-boosting preparations designed to strengthen natural defenses during seasonal shifts.
              </p>
              <Link to="/shop" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-sage-700 hover:text-sage-900">
                View in Shop &rarr;
              </Link>
            </div>

            <div className="card p-6 border border-sage-200/80 bg-cream-50 hover:border-sage-400 transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-100 text-sage-700">
                <HeartHandshake className="h-5 w-5 text-sage-700" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-sage-900">
                Stress & Calm Elixirs
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-500">
                Soothe physical tension and mental fatigue naturally without drowsiness or cognitive haze.
              </p>
              <Link to="/shop" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-sage-700 hover:text-sage-900">
                View in Shop &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Order & Consultation Callout */}
      <section className="py-16 bg-cream-100 border-t border-sage-200/60">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-cream-50 shadow-md">
            <MessageCircle className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-display text-3xl font-semibold text-sage-900">
            Have questions or need custom remedy guidance?
          </h2>
          <p className="mt-3 text-ink-600 max-w-xl mx-auto">
            Connect directly with our practitioner on WhatsApp for instant guidance, availability queries, or personalized ordering.
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href={consultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-emerald-700 active:scale-95"
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
