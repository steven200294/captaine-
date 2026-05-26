import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Clock,
  MapPin,
  Headphones,
  Cookie,
  Signal,
  Globe,
  Users,
  Zap,
  Armchair,
  ChevronRight,
  Gift,
  Sun,
  Snowflake,
  Ticket,
  Anchor,
  CheckCircle,
  LucideIcon,
} from "lucide-react";
import { PRODUCTS, getProductBySlug } from "@shared/products";
import BookingCard from "@web/components/BookingCard";
import ClientReviewsSection from "@web/components/ClientReviewsSection";
import type { ProductFeature } from "@shared/products";

const iconMap: Record<ProductFeature["icon"], LucideIcon> = {
  headphones: Headphones,
  cookie: Cookie,
  signal: Signal,
  globe: Globe,
  users: Users,
  zap: Zap,
  star: Star,
  armchair: Armchair,
};

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f8f9fb]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-[#1c355e] transition-colors">
            Accueil
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href="/croisieres"
            className="hover:text-[#1c355e] transition-colors"
          >
            Croisières
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1c2b4c] font-medium">{product.title}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* LEFT COLUMN */}
          <div>
            {/* Hero Image */}
            <div className="relative h-[420px] md:h-[480px] rounded-2xl overflow-hidden">
              <Image
                src={product.mainImage}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
              <div
                className={`absolute top-4 left-4 text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm ${
                  product.badge.color === "red"
                    ? "bg-[#c3171d]"
                    : "bg-[#28a745]"
                }`}
              >
                {product.badge.text}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-3 mt-3">
              {product.thumbnails.map((thumb, i) => (
                <div
                  key={i}
                  className="relative h-[130px] md:h-[220px] rounded-xl overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-[#1c355e] transition-all"
                >
                  <Image
                    src={thumb}
                    alt={`${product.title} - vue ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Mobile Info (rating, duration, location) */}
            <div className="mt-6 lg:hidden">
              <h1 className="text-2xl font-bold text-[#1c2b4c] mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-1 mb-3">
                <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                <span className="font-bold text-sm text-[#1c2b4c]">
                  {product.rating}
                </span>
                <span className="text-xs text-gray-500">
                  ({product.reviews.toLocaleString()} avis)
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-gray-500 uppercase">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {product.duration}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {product.location}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              {product.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-[#f1f5f9] text-[#475569] text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>

            <hr className="border-gray-200 my-8" />

            {/* Description */}
            <p className="text-[#475569] leading-relaxed">{product.description}</p>
          </div>

          {/* RIGHT COLUMN — sticky booking card */}
          <div className="hidden lg:block">
            <div className="sticky top-[130px]">
              {/* Desktop Info above card */}
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-[#1c2b4c] mb-2">
                  {product.title}
                </h1>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                  <span className="font-bold text-sm text-[#1c2b4c]">
                    {product.rating}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({product.reviews.toLocaleString()} avis)
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-gray-500 uppercase">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {product.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {product.location}
                  </div>
                </div>
              </div>
              <BookingCard product={product} />
            </div>
          </div>
        </div>

        {/* Mobile Booking Card */}
        <div className="mt-8 lg:hidden">
          <BookingCard product={product} />
        </div>

        {/* Features + Premium Options — full width below grid */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-[#1c2b4c] mb-6 uppercase tracking-wide">
            Inclus dans votre offre
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {product.features.map((feature, idx) => {
              const IconComponent = iconMap[feature.icon];
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl p-6 ${
                    feature.highlighted
                      ? "border-2 border-[#f5a623]"
                      : "border border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#f0f4ff] rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-[#1c355e]" />
                    </div>
                    <h3 className="font-bold text-[#1c2b4c]">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <span className="inline-block bg-[#f1f5f9] text-[#475569] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    {feature.label}
                  </span>
                </div>
              );
            })}

            {/* Premium Options Card */}
            <div className="bg-[#1c355e] rounded-2xl p-6 text-white">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300 mb-1">
                AMÉLIOREZ VOTRE EXPÉRIENCE
              </p>
              <h3 className="text-xl font-bold mb-4">Options Premium</h3>
              <div className="flex flex-col gap-3">
                {product.premiumOptions.map((option, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <Gift className="w-4 h-4 text-blue-300 flex-shrink-0" />
                      <span>{option.name}</span>
                    </div>
                    <button className="bg-white text-[#1c355e] text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0 hover:bg-blue-50 transition-colors">
                      +{option.price},00 €
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendrier des croisières */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">

          <h2 className="text-3xl font-bold text-[#1c2b4c] mb-1">Calendrier des croisières</h2>
          <p className="text-sm text-gray-400 uppercase tracking-widest mb-10 font-medium">The Captain Boat · Précision Opérationnelle</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

            {/* Haute saison */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-5 bg-[#1c355e] border-b border-[#1c355e]">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sun className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Haute Saison</h3>
                  <p className="text-xs text-blue-200 font-medium">Avril à Octobre</p>
                </div>
                <span className="ml-auto text-[11px] font-bold bg-white/15 text-white px-3 py-1 rounded-full">Toutes les 30 min · 10h–22h</span>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { period: "Avril – Fin Août", detail: "Départ supplémentaire à 22h30 (sauf jours de semaine en Mai)" },
                  { period: "Juillet & Août", detail: "Départ à 23h00 les : 4, 11, 18, 25 juil. · 1, 8, 14, 15, 22, 29 août" },
                  { period: "29 Août – 1er Nov.", detail: "Dernier départ maintenu à 22h00" },
                ].map(({ period, detail }) => (
                  <div key={period} className="flex items-start gap-4 px-6 py-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f5a623] mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-[12px] font-bold text-[#1c2b4c] uppercase tracking-wide mb-0.5">{period}</p>
                      <p className="text-[13px] text-gray-500">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Basse saison */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-5 bg-[#1c355e] border-b border-[#1c355e]">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Snowflake className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Basse Saison</h3>
                  <p className="text-xs text-blue-200 font-medium">Novembre à Mars</p>
                </div>
                <span className="ml-auto text-[11px] font-bold bg-white/15 text-white px-3 py-1 rounded-full">Toutes les 45 min · 10h15–21h30</span>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { period: "Optimisation soirée", detail: "Départ toutes les 30 min à partir de 16h00" },
                  { period: "Vacances scolaires", detail: "Bateau supplémentaire à 22h00 pendant les vacances" },
                ].map(({ period, detail }) => (
                  <div key={period} className="flex items-start gap-4 px-6 py-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-[12px] font-bold text-[#1c2b4c] uppercase tracking-wide mb-0.5">{period}</p>
                      <p className="text-[13px] text-gray-500">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { Icon: Clock,        label: "Durée",         value: "~1 heure sans escale" },
              { Icon: Ticket,       label: "Validité",      value: "2 ans — Billet non daté" },
              { Icon: Anchor,       label: "Embarquement",  value: "Port de la Conférence, Pont de l'Alma" },
              { Icon: CheckCircle,  label: "Accès",         value: "Direct à la file d'embarquement" },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="bg-[#f8f9fc] rounded-2xl p-5 flex flex-col gap-2">
                <div className="w-9 h-9 bg-[#1c355e] rounded-full flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
                <p className="text-sm font-semibold text-[#1c2b4c] leading-snug">{value}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Google Maps + Accès */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1c2b4c] mb-1">Point de départ</h2>
          <p className="text-gray-500 mb-8 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#c3171d]" />
            Embarcadère Port de la Conférence — Bateaux-Mouches, 75008 Paris
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-lg h-[420px]">
              <iframe
                src="https://maps.google.com/maps?q=Port+de+la+Bourdonnais,+Paris,+France&z=16&output=embed&hl=fr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Access info */}
            <div className="bg-[#f8f9fc] rounded-2xl p-6 flex flex-col gap-5">

              {/* Métro */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-[#1c355e] text-white text-[10px] font-black rounded flex items-center justify-center">M</span>
                  <span className="font-bold text-[#1c2b4c] text-sm uppercase tracking-wide">Métro</span>
                </div>
                <div className="flex flex-col gap-1.5 pl-8">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#9B59B6] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center">9</span>
                    <span className="text-sm text-gray-600">Alma-Marceau</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-[#F9A51A] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center">1</span>
                    <span className="bg-[#6EC6E6] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center">13</span>
                    <span className="text-sm text-gray-600">Champs-Élysées Clémenceau</span>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* RER */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-[#0085C8] text-white text-[10px] font-black rounded flex items-center justify-center">RER</span>
                  <span className="font-bold text-[#1c2b4c] text-sm uppercase tracking-wide">RER</span>
                </div>
                <div className="flex items-center gap-2 pl-8">
                  <span className="bg-[#F6931E] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">C</span>
                  <span className="text-sm text-gray-600">Pont de l'Alma</span>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Bus */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-[#48A94B] text-white text-[10px] font-black rounded flex items-center justify-center">🚌</span>
                  <span className="font-bold text-[#1c2b4c] text-sm uppercase tracking-wide">Bus</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pl-8">
                  {["28","42","49","63","72","80","83","92"].map(n => (
                    <span key={n} className="bg-[#1c355e] text-white text-[11px] font-bold px-2 py-0.5 rounded">{n}</span>
                  ))}
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Parking */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 bg-[#003DA5] text-white text-[10px] font-black rounded flex items-center justify-center">P</span>
                  <span className="font-bold text-[#1c2b4c] text-sm uppercase tracking-wide">Parking</span>
                </div>
                <div className="pl-8">
                  <p className="text-sm text-gray-600 font-medium">Parking gratuit sur le quai</p>
                  <p className="text-xs text-gray-400 mt-0.5">Pendant toute la durée de la croisière</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <ClientReviewsSection />
    </main>
  );
}
