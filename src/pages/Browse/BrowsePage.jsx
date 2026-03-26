import Hero from "../../components/common/Hero";
import SectionHeader from "../../components/common/SectionHeader";

export default function BrowsePage() {
  return (
    <>
      <Hero />

      <div className="section">
        <SectionHeader
          tag="Marketplace"
          title="Today's Fresh Listings"
        />

        <p>Product grid coming next...</p>
      </div>
    </>
  );
}