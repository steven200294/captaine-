"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Clock,
  MapPin,
  Globe2,
  Users,
  Ship,
  Star,
  Navigation,
  Sun,
  Baby,
  Anchor,
  ChevronDown,
  CheckCircle,
  ArrowRight,
  Check,
} from "lucide-react";

const MONUMENTS = [
  {
    name: "Tour Eiffel",
    description:
      "Admirez la Dame de Fer depuis la Seine — un point de vue unique que peu de visiteurs ont la chance de voir. La croisière passe juste au pied de la tour.",
    detail: "Haute de 330 m, visible à 70 km",
    image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=1200&q=80&fit=crop",
  },
  {
    name: "Pont Alexandre III",
    description:
      "Le plus beau pont de Paris, orné de candélabres dorés et de sculptures Art Nouveau. Inauguré en 1900 pour l'Exposition Universelle.",
    detail: "Construit en 1900 — Classé monument historique",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80&fit=crop",
  },
  {
    name: "Musée d'Orsay",
    description:
      "L'ancienne gare devenue temple de l'impressionnisme. Sa façade illuminée en soirée est l'un des plus beaux spectacles de la Seine.",
    detail: "Plus de 3 000 œuvres dont Monet & Renoir",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&q=80&fit=crop",
  },
  {
    name: "Le Louvre",
    description:
      "La façade du plus grand musée du monde, bordant la Seine. Vue imprenable sur la Pyramide de verre depuis l'eau.",
    detail: "36 000 m² d'expositions, 9 millions de visiteurs/an",
    image: "https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?w=1200&q=80&fit=crop",
  },
  {
    name: "Notre-Dame de Paris",
    description:
      "La cathédrale gothique renait de ses cendres. Depuis la Seine, observez la façade restaurée de l'île de la Cité, symbole de résilience.",
    detail: "Réouverture en décembre 2024 après 5 ans de restauration",
    image: "https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?w=1200&q=80&fit=crop",
  },
  {
    name: "Les Invalides",
    description:
      "Le dôme doré du tombeau de Napoléon brille face à la Seine. Un chef-d'œuvre du classicisme français du XVIIe siècle.",
    detail: "Construit en 1676 sous Louis XIV",
    image: "https://images.unsplash.com/photo-1549144511-f099e773c147?w=1200&q=80&fit=crop",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Rendez-vous au Port",
    description:
      "Retrouvez-nous au Port de la Bourdonnais, situé au pied de la Tour Eiffel côté Champ-de-Mars. Arrivez 15 minutes avant le départ pour l'embarquement.",
    icon: <MapPin className="w-6 h-6" />,
  },
  {
    number: "02",
    title: "Embarquement",
    description:
      "Montez à bord de notre bateau confortable et choisissez votre place — en terrasse panoramique ou dans le salon intérieur climatisé.",
    icon: <Anchor className="w-6 h-6" />,
  },
  {
    number: "03",
    title: "La Croisière",
    description:
      "Pendant 1 heure, glissez sur la Seine et découvrez les plus beaux monuments de Paris avec le commentaire audio disponible en 12 langues.",
    icon: <Ship className="w-6 h-6" />,
  },
  {
    number: "04",
    title: "Retour au Port",
    description:
      "La croisière se termine là où elle a commencé — au Port de la Bourdonnais. Repartez avec des souvenirs plein la tête.",
    icon: <Navigation className="w-6 h-6" />,
  },
];

const PRACTICAL = [
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Horaires",
    lines: [
      "Départs toutes les 30 à 45 min",
      "10h00 → 22h30 (été)",
      "10h30 → 21h30 (hiver)",
    ],
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    title: "Point de départ",
    lines: [
      "Port de la Bourdonnais",
      "Quai Branly, Paris 7e",
      "Face à la Tour Eiffel",
    ],
  },
  {
    icon: <Globe2 className="w-5 h-5" />,
    title: "Commentaire audio",
    lines: [
      "Inclus dans tous les billets",
      "12 langues disponibles",
      "FR · EN · ES · DE · IT · PT · JA · ZH · KO · RU · AR · NL",
    ],
  },
  {
    icon: <Baby className="w-5 h-5" />,
    title: "Tarifs spéciaux",
    lines: [
      "Enfants < 4 ans : Gratuit",
      "Enfants 4-12 ans : tarif réduit",
      "Groupes : nous contacter",
    ],
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Accessibilité",
    lines: [
      "Bateau accessible PMR",
      "Places réservées disponibles",
      "Poussettes acceptées",
    ],
  },
  {
    icon: <Sun className="w-5 h-5" />,
    title: "Meilleure période",
    lines: [
      "Coucher de soleil (19h-20h) 🌅",
      "Croisière nocturne illuminée 🌙",
      "Toute l'année, par tous temps",
    ],
  },
];

const FAQ = [
  {
    question: "Quelle est la durée de la croisière ?",
    answer:
      "La croisière dure exactement 1 heure. Vous partirez du Port de la Bourdonnais, remonterez la Seine jusqu'à l'île de la Cité (Notre-Dame, Pont-Neuf) et reviendrez au point de départ.",
  },
  {
    question: "Faut-il réserver à l'avance ?",
    answer:
      "Nous recommandons fortement de réserver en ligne pour garantir votre place, surtout en haute saison (avril-octobre) et les week-ends. La confirmation est immédiate et vous recevrez votre billet par email.",
  },
  {
    question: "Peut-on annuler ou modifier sa réservation ?",
    answer:
      "Oui, l'annulation est gratuite jusqu'à 24 heures avant le départ. Vous pouvez aussi modifier la date et l'heure de votre croisière sans frais dans le même délai.",
  },
  {
    question: "Le bateau est-il couvert en cas de pluie ?",
    answer:
      "Notre bateau dispose d'un salon intérieur entièrement vitré et climatisé, ainsi que d'une terrasse panoramique supérieure à ciel ouvert. La croisière a lieu quelles que soient les conditions météorologiques.",
  },
  {
    question: "Les enfants en bas âge paient-ils ?",
    answer:
      "Les enfants de moins de 4 ans voyagent gratuitement (sans occuper de siège). Les enfants de 4 à 12 ans bénéficient d'un tarif enfant réduit.",
  },
];

export default function CroisieresPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeMonument, setActiveMonument] = useState(0);

  return (
    <main className="min-h-screen bg-[#fafafc] selection:bg-[#1c355e] selection:text-white pb-20">
      

      {/* ── INTRO / EXPERIENCE ─────────────────────────────────────── */}
      <section className="pt-24 pb-24 bg-[#fafafc] relative">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Text Content */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-8 h-[2px] bg-[#FFB800]"></div>
                <span className="text-[#1c355e] font-bold tracking-[0.2em] uppercase text-xs">
                  La magie de Paris
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#1c355e] leading-[1.1] mb-8">
                Paris vue depuis l'eau, <br />
                <span className="font-serif italic font-medium text-gray-500">une expérience absolue</span>
              </h2>
              <p className="text-[#475569] text-lg leading-relaxed mb-6 font-medium">
                La Seine est l'âme de Paris. Depuis l'Antiquité, elle a façonné
                la ville, inspiré les peintres et séduit des millions de visiteurs. 
                Une croisière vous offre un point de vue intime et majestueux.
              </p>
              <p className="text-[#64748b] text-base leading-relaxed mb-8">
                À bord de nos bateaux panoramiques, laissez-vous porter par le courant pendant une heure d'émerveillement. Chaque pont et chaque quai raconte une page de l'histoire de France.
              </p>
              
              <ul className="space-y-4 mb-10">
                {[
                  "Vue imprenable à 360°",
                  "Confort exceptionnel à bord",
                  "Adapté à toute la famille",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1c355e]/5 flex items-center justify-center">
                      <Check className="w-4 h-4 text-[#1c355e]" />
                    </div>
                    <span className="text-base font-bold text-[#1c355e]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Link href="#offres" className="inline-flex items-center justify-center px-6 py-3 bg-[#1c355e] text-white font-semibold rounded-full hover:bg-[#132545] transition-colors shadow-lg">
                Explorer nos offres
              </Link>
            </div>

            {/* Image Composition */}
            <div className="order-1 lg:order-2 relative h-[500px] w-full">
              <div className="absolute top-0 right-0 w-[80%] h-[80%] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgb(0,0,0,0.1)] z-10 border-8 border-[#fafafc]">
                <Image
                  src="/images/croisieres/experience.png"
                  alt="Dîner croisière"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-[60%] h-[50%] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgb(0,0,0,0.15)] z-20 border-8 border-[#fafafc]">
                <Image
                  src="/images/croisieres/monuments.png"
                  alt="Vue depuis la Seine"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Floating review */}
              <div className="absolute top-1/2 -translate-y-1/2 -left-8 z-30 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 max-w-[200px] hidden md:block">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
                  ))}
                </div>
                <p className="text-xs font-bold text-[#1c355e] leading-snug">"Un moment magique, le bateau est superbe !"</p>
                <p className="text-[10px] text-gray-500 mt-2">— Marie L.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MONUMENTS CAROUSEL ────────────────────────────────────────────── */}
      <section id="itineraire" className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-[#FFB800] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">
                Itinéraire
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#1c355e] leading-tight">
                Les chefs-d'œuvre <br />
                que vous allez longer
              </h2>
            </div>
            <div className="bg-[#f8f9fc] px-5 py-3 rounded-2xl border border-gray-200 flex items-center gap-3 self-start md:self-auto">
              <Navigation className="w-4 h-4 text-[#1c355e]" />
              <span className="font-semibold text-[#1c355e] text-sm">Départ & Retour — Port de la Bourdonnais</span>
            </div>
          </div>

          {/* Carousel */}
          <div>
            {/* Main image */}
            <div className="relative w-full h-[340px] sm:h-[440px] md:h-[520px] rounded-2xl overflow-hidden mb-6">
              <Image
                key={MONUMENTS[activeMonument].name}
                src={MONUMENTS[activeMonument].image}
                alt={MONUMENTS[activeMonument].name}
                fill
                className="object-cover transition-opacity duration-500"
                sizes="(max-width: 1024px) 100vw, 900px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* Detail pill */}
              <div className="absolute top-5 left-5">
                <span className="bg-white/15 backdrop-blur-sm border border-white/25 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                  {MONUMENTS[activeMonument].detail}
                </span>
              </div>

              {/* Counter */}
              <div className="absolute top-5 right-5 bg-black/30 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {activeMonument + 1} / {MONUMENTS.length}
              </div>

              {/* Prev / Next arrows */}
              <button
                onClick={() => setActiveMonument((activeMonument - 1 + MONUMENTS.length) % MONUMENTS.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors border border-white/20"
                aria-label="Monument précédent"
              >
                <ChevronDown className="w-5 h-5 text-white rotate-90" />
              </button>
              <button
                onClick={() => setActiveMonument((activeMonument + 1) % MONUMENTS.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors border border-white/20"
                aria-label="Monument suivant"
              >
                <ChevronDown className="w-5 h-5 text-white -rotate-90" />
              </button>

              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white font-extrabold text-2xl md:text-3xl drop-shadow">
                  {MONUMENTS[activeMonument].name}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-[#475569] text-base leading-relaxed mb-8 max-w-2xl">
              {MONUMENTS[activeMonument].description}
            </p>

            {/* Thumbnail strip */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {MONUMENTS.map((m, idx) => (
                <button
                  key={m.name}
                  onClick={() => setActiveMonument(idx)}
                  className={`relative flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden transition-all duration-200 ${
                    idx === activeMonument
                      ? "ring-2 ring-[#1c355e] ring-offset-2 opacity-100"
                      : "opacity-50 hover:opacity-80"
                  }`}
                  aria-label={m.name}
                >
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    className="object-cover"
                      />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* ── NEW SECTION: PARIS BY NIGHT ──────────────────────── */}
      <section className="relative w-full py-32 lg:py-40 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/croisieres/night.png"
            alt="La Seine de nuit"
            fill
            className="object-cover scale-105"
          />
          <div className="absolute inset-0 bg-[#0a1930]/70" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
          <div className="w-16 h-16 mx-auto bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-8">
            <Star className="w-8 h-8 text-[#FFB800] fill-[#FFB800]" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8">
            Paris sous les étoiles
          </h2>
          <p className="text-xl text-blue-100/90 font-medium leading-relaxed mb-10">
            Dès la tombée de la nuit, la magie opère. La Ville Lumière s'illumine sous vos yeux. De la Tour Eiffel scintillante aux ponts romantiques, profitez d'un spectacle nocturne inoubliable.
          </p>
          <Link href="#offres" className="inline-flex items-center justify-center px-8 py-4 bg-[#FFB800] text-[#1c355e] font-bold rounded-full hover:bg-white transition-colors shadow-xl">
            Réserver une croisière nocturne
          </Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-24 bg-[#1c355e] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#FFB800] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">
              Déroulé
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Votre croisière pas à pas
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, index) => (
              <div key={step.number} className="relative flex flex-col items-start bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-colors group">
                <div className="text-6xl font-black text-white/5 absolute top-4 right-4 pointer-events-none transition-transform group-hover:scale-110">
                  {step.number}
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#FFB800] flex items-center justify-center text-[#1c355e] mb-6 shadow-[0_0_20px_rgba(255,184,0,0.3)]">
                  {step.icon}
                </div>
                <h3 className="font-bold text-white text-lg mb-3">
                  {step.title}
                </h3>
                <p className="text-blue-100/70 text-sm leading-relaxed font-medium">
                  {step.description}
                </p>
                {/* Connection Line for Desktop */}
                {index < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[2px] bg-gradient-to-r from-white/20 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRACTICAL INFO ────────────────────────────────────── */}
      <section className="py-24 bg-[#fafafc]">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-[#1c355e] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">
              Préparer votre visite
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1c355e]">
              Informations Pratiques
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRACTICAL.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgb(28,53,94,0.06)] transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-[#1c355e]">
                    {item.icon}
                  </div>
                  <h3 className="font-extrabold text-[#1c355e] text-base">
                    {item.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {item.lines.map((line) => (
                    <li key={line} className="text-[#64748b] text-sm font-medium flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FFB800] mt-1.5 flex-shrink-0" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Access Banner */}
          <div className="mt-12 bg-[#1c355e] rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            
            <div className="flex-shrink-0 w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 z-10">
              <MapPin className="w-10 h-10 text-[#FFB800]" />
            </div>
            
            <div className="text-center md:text-left flex-1 z-10">
              <h3 className="text-white font-extrabold text-2xl mb-2">
                Port de la Bourdonnais
              </h3>
              <p className="text-blue-100 text-base mb-2 font-medium">
                Quai Branly — 75007 Paris · Face à la Tour Eiffel
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                <span className="bg-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10">M6 Bir-Hakeim</span>
                <span className="bg-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10">RER C Champ-de-Mars</span>
              </div>
            </div>
            
            <Link
              href="/contact"
              className="flex-shrink-0 bg-white text-[#1c355e] font-bold px-8 py-4 rounded-full text-sm hover:bg-gray-50 transition-colors shadow-lg z-10"
            >
              Voir le plan d'accès
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-16">
            <span className="text-[#FFB800] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">
              Vos Questions
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1c355e]">
              Foire aux questions
            </h2>
          </div>
          
          <div className="space-y-4">
            {FAQ.map((item, index) => (
              <div
                key={index}
                className={`border border-gray-100 rounded-3xl overflow-hidden transition-all duration-300 ${openFaq === index ? 'bg-[#fafafc] shadow-sm' : 'bg-white hover:border-gray-200'}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className={`font-bold text-base pr-8 ${openFaq === index ? 'text-[#1c355e]' : 'text-[#475569]'}`}>
                    {item.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${openFaq === index ? 'bg-[#1c355e] text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-[#64748b] font-medium leading-relaxed text-sm">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="py-10 px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl bg-gradient-to-br from-[#1c355e] to-[#0a1930] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(28,53,94,0.3)]">
          {/* Background decor */}
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-[#FFB800]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 mb-8 shadow-xl">
              <Anchor className="w-10 h-10 text-[#FFB800]" />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
              Prêt à vivre <br /> l'expérience parisienne ?
            </h2>
            
            <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto font-medium">
              Réservez votre croisière sur la Seine en quelques clics. Confirmation immédiate, annulation gratuite jusqu'à 24h avant.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="#offres"
                className="bg-[#FFB800] hover:bg-white text-[#1c355e] font-extrabold px-10 py-5 rounded-full text-base transition-all hover:scale-105 shadow-[0_10px_30px_rgba(255,184,0,0.3)] w-full sm:w-auto"
              >
                Voir nos offres
              </Link>
              <Link
                href="/contact"
                className="bg-transparent hover:bg-white/10 text-white font-bold px-10 py-5 rounded-full text-base transition-colors border-2 border-white/20 w-full sm:w-auto"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
