import FilterBestOffers from "./filters/FilterBestOffers";
import FilterOfferType from "./filters/FilterOfferType";
import FilterPrice from "./filters/FilterPrice";
import FilterDuration from "./filters/FilterDuration";
import ContactWidget from "./filters/ContactWidget";

export default function SidebarFilter() {
  return (
    <aside className="w-full lg:w-[320px] flex-shrink-0">
      <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-200 shadow-sm flex flex-col gap-8">
        <FilterBestOffers />
        <div className="h-px w-full bg-gray-100"></div>
        <FilterOfferType />
        <div className="h-px w-full bg-gray-100"></div>
        <FilterPrice />
        <div className="h-px w-full bg-gray-100"></div>
        <FilterDuration />
      </div>
      
      <div className="mt-6">
        <ContactWidget />
      </div>
    </aside>
  );
}
