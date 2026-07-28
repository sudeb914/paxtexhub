import type { Metadata } from "next";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedCars } from "@/components/home/featured-cars";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { SellerCta } from "@/components/home/seller-cta";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getWordPressHomeData } from "@/services/wordpress/wordpress-home-service";
import type { WordPressHomeData } from "@/services/wordpress/wordpress-home-service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Find Your Dream Car",
  description: "Browse trusted cars for sale or list your vehicle with AutoHub.",
};

export default async function Home() {
  let data: WordPressHomeData = { featuredCars: [], brands: [], carTypes: [], locations: [] };
  try {
    data = await getWordPressHomeData();
  } catch (error) {
    console.error("Unable to load WordPress Home data", error);
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero brands={data.brands} carTypes={data.carTypes} locations={data.locations} />
        <FeaturedCars cars={data.featuredCars} />
        <CategoryGrid categories={data.carTypes} />
        <SellerCta />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
