import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import AdditionalInfoTab from "./AdditionalInfoTab";
import DiscoverTab from "./DiscoverTab";
import ReviewsTab from "./ReviewsTab";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function DetailsInformation({ details }: any) {
  const [activeSection, setActiveSection] = useState("specifications");
  const isClickedRef = useRef(false);

  const scrollToSection = (sectionId: string) => {
    isClickedRef.current = true; // Mark as clicked
    setActiveSection(sectionId); // Persist active section
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });

    // setTimeout(() => {
    //   isClickedRef.current = false;
    // }, 1500);
  };

  useEffect(() => {
    const sections = ["specifications", "description", "reviews"];
    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickedRef.current) return; // Don't override if user clicked

        const visibleSection = entries.find((entry) => entry.isIntersecting);
        if (visibleSection) {
          setActiveSection(visibleSection.target.id);
        }
      },
      { threshold: 0.6 }
    );

    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <SectionWrapper>
        {/* Navigation */}
        <div className="flex gap-5 lg:gap-10 justify-start">
          {[
            { id: "specifications", label: "Specification" },
            { id: "description", label: "Description" },
            {
              id: "reviews",
              label: `Reviews (${details?.Review?.length || 0})`,
            },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`relative pb-0.5 text-base md:text-xl lg:text-3xl tracking-wider font-semibold transition-colors ${
                activeSection === id ? "text-primary" : "text-gray-800"
              }`}
            >
              {label}
              {activeSection === id && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </SectionWrapper>
      {/* Page Content */}
      <div className="md:py-6 space-y-10 px-0 md:px-2 mt-2 md:mt-0">
        {details?.specification?.length > 0 && (
          <section id="specifications" className="">
            <DiscoverTab specification={details?.specification} />
          </section>
        )}

        {details?.description?.length > 0 && (
          <section id="description" className="">
            <AdditionalInfoTab description={details?.description} />
          </section>
        )}

        <section id="reviews" className="">
          <ReviewsTab description={details} />
        </section>

        <section>
          <hr />
          {/* Displaying subcategories dynamically */}
          <div className="flex items-center gap-5 py-5 bg-white px-3 rounded-lg shadow-md">
            <div>
              <span className="text-gray-700 font-bold">Categories:</span>
              <span className="text-primary ml-2">
                {/* Loop through subcategories and display them */}
                {details?.subCategory?.map((subcategory, index) => (
                  <span key={subcategory.id}>
                    {/* If it's not the first subcategory, add a separator */}
                    {index > 0 && ", "}
                    <Link
                      to={`/sub-category/${subcategory?.subCategory?.link}`}
                    >
                      {subcategory?.subCategory?.name || ""}
                    </Link>
                  </span>
                ))}
              </span>
            </div>
             {details?.Tags?.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-gray-700 font-bold">Tags:</span>
                {details.Tags.map((tagItem, index) => (
                  <span key={tagItem.id} className="flex items-center">
                    {index > 0 && <span className="mx-1">,</span>}
                    <Link
                      to={`/product-tag/${tagItem.tag}`}
                      className="text-primary"
                    >
                      {tagItem.tag}
                    </Link>
                  </span>
                ))}
              </div>
            )}
          </div>
          <hr />
        </section>
      </div>
    </div>
  );
}
