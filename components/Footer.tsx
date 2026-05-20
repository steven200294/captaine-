import { CalendarCheck, Zap, BadgeCheck, ShieldCheck, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20 font-sans">

      {/* Top section: Trust Badges */}
      <div className="container mx-auto px-4 lg:px-8 max-w-[1400px] py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-1 text-center">

          <div className="flex flex-col items-center">
            <div className="mb-2.5 text-[#1c2b4c]">
              <CalendarCheck className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <h4 className="text-[11px] font-bold text-[#1c2b4c] uppercase tracking-wider mb-1.5">
              Annulation Gratuite
            </h4>
            <p className="text-gray-500 text-[11px]">
              Jusqu'à 24h avant
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="mb-2.5 text-[#1c2b4c]">
              <Zap className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <h4 className="text-[11px] font-bold text-[#1c2b4c] uppercase tracking-wider mb-1.5">
              Confirmation Immédiate
            </h4>
            <p className="text-gray-500 text-[11px]">
              <span className="border-b-2 border-[#2563eb] pb-0.5 inline-block">
                Réservez en 1 min
              </span>
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="mb-2.5 text-[#1c2b4c]">
              <BadgeCheck className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <h4 className="text-[11px] font-bold text-[#1c2b4c] uppercase tracking-wider mb-1.5">
              Garantie Meilleur Prix
            </h4>
            <p className="text-gray-500 text-[11px]">
              Vous ne trouverez pas moins cher
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="mb-2.5 text-[#1c2b4c]">
              <ShieldCheck className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <h4 className="text-[11px] font-bold text-[#1c2b4c] uppercase tracking-wider mb-1.5">
              Paiement Sécurisé
            </h4>
            <p className="text-gray-500 text-[11px]">
              100% Protégé
            </p>
          </div>

        </div>
      </div>

      {/* Newsletter Section */}
      <div className="container mx-auto px-4 lg:px-8 max-w-[1400px]">
        <div className="bg-[#1c355e] rounded-2xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="text-center lg:text-left flex-1">
            <h3 className="text-white text-[22px] md:text-2xl font-medium mb-1.5">Newsletter</h3>
            <p className="text-blue-100/80 text-[15px]">
              Be the first one to know about discounts, offers and events
            </p>
          </div>
          <div className="w-full lg:w-auto flex-[1.2] max-w-xl">
            <form className="flex flex-col sm:flex-row items-center bg-[#0a1830] rounded-xl p-1.5 w-full">
              <div className="flex items-center w-full px-4 py-3 sm:py-0">
                <Mail className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-transparent text-white w-full focus:outline-none text-[15px] placeholder:text-gray-400"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-white text-[#059669] font-medium px-10 py-3 rounded-lg hover:bg-gray-50 transition-colors mt-2 sm:mt-0 text-[15px]"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="container mx-auto px-4 lg:px-8 max-w-[1400px] py-20 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12">

          {/* Col 1 */}
          <div>
            <h4 className="text-[#111827] font-semibold text-[17px] mb-6">About</h4>
            <ul className="space-y-4">
              {['About Us', 'Blog', 'Careers', 'Jobs', 'In Press'].map((item) => (
                <li key={item}><Link href="#" className="text-gray-500 hover:text-[#1c2b4c] text-[15px] transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-[#111827] font-semibold text-[17px] mb-6">Support</h4>
            <ul className="space-y-4">
              {['Contact Us', 'Online Chat', 'Whatsapp', 'Telegram', 'Ticketing'].map((item) => (
                <li key={item}><Link href="#" className="text-gray-500 hover:text-[#1c2b4c] text-[15px] transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-[#111827] font-semibold text-[17px] mb-6">FAQ</h4>
            <ul className="space-y-4">
              {['Account', 'Manage Deliveries', 'Orders', 'Payments', 'Returns'].map((item) => (
                <li key={item}><Link href="#" className="text-gray-500 hover:text-[#1c2b4c] text-[15px] transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-[#111827] font-semibold text-[17px] mb-6">About</h4>
            <ul className="space-y-4">
              {['About Us', 'Blog', 'Careers', 'Jobs', 'In Press'].map((item) => (
                <li key={item}><Link href="#" className="text-gray-500 hover:text-[#1c2b4c] text-[15px] transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Col 5 */}
          <div>
            <h4 className="text-[#111827] font-semibold text-[17px] mb-6">Support</h4>
            <ul className="space-y-4">
              {['Contact Us', 'Online Chat', 'Whatsapp', 'Telegram', 'Ticketing'].map((item) => (
                <li key={item}><Link href="#" className="text-gray-500 hover:text-[#1c2b4c] text-[15px] transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Col 6 */}
          <div>
            <h4 className="text-[#111827] font-semibold text-[17px] mb-6">FAQ</h4>
            <ul className="space-y-4">
              {['Account', 'Manage Deliveries', 'Orders', 'Payments', 'Returns'].map((item) => (
                <li key={item}><Link href="#" className="text-gray-500 hover:text-[#1c2b4c] text-[15px] transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container mx-auto px-4 lg:px-8 max-w-[1400px]">
        <div className="border-t border-gray-200 py-6 md:py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <ul className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3">
            {['About us', 'Contact', 'Privacy policy', 'Sitemap', 'Terms of Use'].map((item) => (
              <li key={item}><Link href="#" className="text-[#6b7280] hover:text-[#1c2b4c] text-[13px]">{item}</Link></li>
            ))}
          </ul>
          <p className="text-[#9ca3af] text-[13px]">
            © 2000-2024, All Rights Reserved
          </p>
        </div>
      </div>

    </footer>
  );
}
