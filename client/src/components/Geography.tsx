"use client";

const countries = [
  {
    name: "United Kingdom",
    flag: "🇬🇧",
    products: "6.3K",
  },
  {
    name: "Indonesia",
    flag: "🇮🇩",
    products: "5.2K",
  },
  {
    name: "Malaysia",
    flag: "🇲🇾",
    products: "4.7K",
  },
  {
    name: "China",
    flag: "🇨🇳",
    products: "4.5K",
  },
  {
    name: "Thailand",
    flag: "🇹🇭",
    products: "3.2K",
  },
  {
    name: "Philippines",
    flag: "🇵🇭",
    products: "2.9K",
  },
];

export function SalesByCountry() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#232630] bg-[#16181d] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-semibold text-white">Sales by Country</h3>
        <button
          type="button"
          className="text-[11px] font-medium text-[#737a89] transition-colors hover:text-white"
        >
          View All
        </button>
      </div>

      {/* 2x3 Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {countries.map((country) => (
          <div
            key={country.name}
            className="flex flex-col justify-between rounded-xl border border-[#21242e] bg-[#1a1d24] p-3 transition-colors hover:border-[#2f3442]"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base leading-none">{country.flag}</span>
              <span className="text-[11px] font-medium text-[#8d93a1] truncate">
                {country.name}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[14px] font-bold text-white">
                {country.products}
              </span>
              <span className="text-[10px] text-[#636a78]">Products</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Backwards compatibility alias
export const GeographicPreview = SalesByCountry;
export default SalesByCountry;
