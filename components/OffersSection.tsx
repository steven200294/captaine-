import { FilterProvider } from "./FilterContext";
import SidebarFilter from "./SidebarFilter";
import OfferList from "./OfferList";

export default function OffersSection() {
  return (
    <FilterProvider>
      <section className="bg-[#f8f9fc] py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl flex flex-col lg:flex-row gap-8 lg:gap-12">
          <SidebarFilter />
          <OfferList />
        </div>
      </section>
    </FilterProvider>
  );
}
