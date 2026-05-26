import Image from "next/image";
import { MessageCircle } from "lucide-react";

export default function ContactWidget() {
  return (
    <div className="bg-gray-100/80 rounded-2xl p-6 mt-4 flex flex-col items-center text-center">
      <div className="relative w-32 h-32 mb-4">
        <Image
          src="/images/logo/captaine.png"
          alt="The Captain Boat"
          fill
          className="object-contain"
        />
      </div>
      <button className="w-full bg-[#1c355e] hover:bg-[#132545] text-white text-sm font-semibold py-3 px-4 rounded-full transition-colors mb-3">
        Discuter avec nous
      </button>
      <button className="w-full bg-white border border-[#28a745] text-[#28a745] hover:bg-[#f0fdf4] text-sm font-semibold py-3 px-4 rounded-full transition-colors flex items-center justify-center gap-2">
        <MessageCircle className="w-4 h-4" />
        WhatsApp
      </button>
    </div>
  );
}
