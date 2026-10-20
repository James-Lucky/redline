import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { MetricCard } from "@/components/MetricCard";
import { OrdersByTime } from "@/components/OrdersByTime";
import { MonthlySalesChart } from "@/components/CrimeChart";
import { SalesByCountry } from "@/components/Geography";
import { TopProductSales } from "@/components/TopProductSales";
import { Analytics } from "@/components/Analytics";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0e1013] text-white">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex min-h-screen flex-col md:pl-[230px]">
        {/* Top Header */}
        <Topbar />

        {/* Dashboard Grid Container */}
        <main className="flex-1 space-y-4 px-4 pb-28 pt-4 md:px-8">
          {/* Row 1: Key Metric Cards */}
          <section
            aria-label="Key Performance Indicators"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            <MetricCard
              label="Total Revenue"
              value="24,500"
              currencyPrefix="$"
              change="+12.5%"
              isPositive={true}
              timeRange="From Jun 01,2024 To Jun 29, 2024"
            />
            <MetricCard
              label="Total Order"
              value="1,240"
              change="+8.2%"
              isPositive={true}
              timeRange="From Jun 01,2024 To Jun 29, 2024"
            />
            <MetricCard
              label="New customer"
              value="320"
              change="-4.3%"
              isPositive={false}
              timeRange="From Jun 01,2024 To Jun 29, 2024"
            />
            <MetricCard
              label="Conversion rate"
              value="3.2 %"
              change="+2.1%"
              isPositive={true}
              timeRange="From Jun 01,2024 To Jun 29, 2024"
            />
          </section>

          {/* Row 2: Middle Section (Orders by time heatmap + Monthly Sales Chart) */}
          <section
            aria-label="Order Distribution and Sales Trends"
            className="grid grid-cols-1 gap-4 lg:grid-cols-12"
          >
            {/* Orders by time Heatmap (approx 5 cols on lg/xl) */}
            <div className="lg:col-span-5">
              <OrdersByTime />
            </div>

            {/* Monthly Sales Performance (approx 7 cols on lg/xl) */}
            <div className="lg:col-span-7">
              <MonthlySalesChart />
            </div>
          </section>

          {/* Row 3: Bottom Section (Sales by Country + Top Product Sales) */}
          <section
            aria-label="Country Breakdown and Top Product Sales"
            className="grid grid-cols-1 gap-4 lg:grid-cols-12"
          >
            {/* Sales by Country (approx 5 cols on lg/xl) */}
            <div className="lg:col-span-5">
              <SalesByCountry />
            </div>

            {/* Top Product Sales Table (approx 7 cols on lg/xl) */}
            <div className="lg:col-span-7">
              <TopProductSales />
            </div>
          </section>
        </main>

        {/* Bottom Floating Chat Input & AI Analyst */}
        <Analytics />
      </div>
    </div>
  );
}
