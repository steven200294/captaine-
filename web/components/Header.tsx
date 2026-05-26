"use client";

import Image from "next/image";
import Link from "next/link";
import { Globe, ShoppingCart, Menu, X, Ticket } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import LanguageModal from "./LanguageModal";
import { useCart } from "@web/contexts/CartContext";

const NAV_LINKS = [
  { href: "/", label: "ACCUEIL" },
  { href: "/produits", label: "PRODUITS" },
  { href: "/a-propos", label: "A PROPOS" },
  { href: "/blog", label: "BLOG" },
  { href: "/contact", label: "CONTACT" },
];

export default function Header() {
  const pathname = usePathname();
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const { itemCount } = useCart();
  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    if (itemCount === 0) return;
    setCartBounce(true);
    const t = setTimeout(() => setCartBounce(false), 600);
    return () => clearTimeout(t);
  }, [itemCount]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8 h-[64px] sm:h-[72px] lg:h-[88px] flex items-center justify-between gap-2">
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src="/images/logo/captaine.png"
                alt="The Captain Boat Logo"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 40px, (max-width: 1024px) 48px, 64px"
              />
            </div>
            <div className="font-extrabold text-[14px] sm:text-[16px] lg:text-[22px] text-[#0f172a] tracking-tight leading-none truncate">
              THE CAPTAIN <span className="text-[#0f172a]">BOAT</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-bold text-[#334155] tracking-wide ml-4">
            {NAV_LINKS.slice(0, -1).map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`relative py-2 ${isActive(link.href) ? "text-[#0f172a]" : "hover:text-[#0f172a] transition-colors"}`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#FFB800] rounded-t-sm"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions (desktop) */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/contact"
              className={`hidden lg:block text-[13px] font-bold tracking-wide transition-colors ${
                isActive("/contact") ? "text-[#0f172a]" : "text-[#334155] hover:text-[#0f172a]"
              }`}
            >
              CONTACT
            </Link>

            <div className="flex items-center gap-4 border-l border-gray-200 pl-6 ml-2">
              <Link
                href="/ma-reservation"
                className="text-[#334155] hover:text-[#0f172a] transition-colors"
                aria-label="Ma réservation"
                title="Ma réservation"
              >
                <Ticket className="w-5 h-5" strokeWidth={2} />
              </Link>
              <button
                onClick={() => setIsLangModalOpen(true)}
                className="text-[#334155] hover:text-[#0f172a] transition-colors"
                aria-label="Change language"
              >
                <Globe className="w-5 h-5" strokeWidth={2} />
              </button>
              <Link href="/panier" className="relative text-[#334155] hover:text-[#0f172a] transition-colors" aria-label="Panier">
                <ShoppingCart
                  className={`w-5 h-5 transition-transform ${cartBounce ? "scale-125" : "scale-100"}`}
                  strokeWidth={2}
                />
                {itemCount > 0 && (
                  <span className={`absolute -top-2 -right-2 bg-[#f5a623] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ${cartBounce ? "animate-bounce" : ""}`}>
                    {itemCount}
                  </span>
                )}
              </Link>
              <Link
                href="/produits"
                className="bg-[#FFB800] hover:bg-[#f0ad00] text-[#0f172a] font-bold text-sm px-6 py-2.5 rounded-full transition-all ml-2"
              >
                RÉSERVER
              </Link>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsLangModalOpen(true)}
              className="p-2 text-[#334155] hover:text-[#0f172a] transition-colors"
              aria-label="Change language"
            >
              <Globe className="w-5 h-5" strokeWidth={2} />
            </button>
            <Link href="/panier" className="relative p-2 text-[#334155] hover:text-[#0f172a] transition-colors" aria-label="Panier">
              <ShoppingCart
                className={`w-5 h-5 transition-transform ${cartBounce ? "scale-125" : "scale-100"}`}
                strokeWidth={2}
              />
              {itemCount > 0 && (
                <span className={`absolute top-0 right-0 bg-[#f5a623] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ${cartBounce ? "animate-bounce" : ""}`}>
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 text-[#334155] hover:text-[#0f172a] transition-colors"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-6 h-6" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 animate-in fade-in duration-200"
            onClick={() => setIsMenuOpen(false)}
          />
          {/* Drawer */}
          <aside className="absolute right-0 top-0 bottom-0 w-[80%] max-w-xs bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 h-[64px] border-b border-gray-100">
              <span className="font-extrabold text-[15px] text-[#0f172a] tracking-tight">
                MENU
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-[#334155] hover:text-[#0f172a]"
                aria-label="Fermer le menu"
              >
                <X className="w-6 h-6" strokeWidth={2} />
              </button>
            </div>

            {/* Drawer nav */}
            <nav className="flex-1 overflow-y-auto py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center px-5 py-3 text-sm font-bold tracking-wide transition-colors ${
                    isActive(link.href)
                      ? "text-[#0f172a] bg-[#fff8e6] border-l-4 border-[#FFB800]"
                      : "text-[#334155] hover:bg-gray-50 border-l-4 border-transparent"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div className="p-5 border-t border-gray-100">
              <Link
                href="/produits"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center bg-[#FFB800] hover:bg-[#f0ad00] text-[#0f172a] font-bold text-sm px-6 py-3 rounded-full transition-all"
              >
                RÉSERVER
              </Link>
            </div>
          </aside>
        </div>
      )}

      <LanguageModal isOpen={isLangModalOpen} onClose={() => setIsLangModalOpen(false)} />
    </>
  );
}
