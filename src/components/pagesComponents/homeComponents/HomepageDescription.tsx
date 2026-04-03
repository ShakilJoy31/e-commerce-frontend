import DOMPurify from "dompurify";

const HomepageDescription = ({description}) => {
  console.log(description)
    
    // const sanitizedDescription = DOMPurify.sanitize(description?.data[0]?.whyKry);
    
    // Hard-coded static data with bold formatting using <strong> tags
    const hardCodedContent = `<strong>About SYSTECH BD - Trusted IT Solution & Training Center in Bangladesh</strong>

SYSTECH BD IT SOLUTION & TRAINING CENTER is a leading provider of comprehensive IT solutions, sales, and training, proudly serving the Singair, Manikganj area since our establishment on October 28, 2014.

Our core vision is to bridge the technological gap by providing high-quality, end-to-end IT solutions—from the grassroots level to high-end corporate needs—all while maintaining an affordable and reasonable cost.

We are deeply committed to driving digital accessibility and empowering the local community through technology. Our mission focuses on three key pillars: <strong>Grassroots IT Solutions</strong>, <strong>Youth Development & Career Building</strong>, and <strong>Affordable Technology</strong>.

Based in Singair, Manikganj, we operate as a full-service center specializing in the sale, service, and maintenance of a wide range of IT and security products including Computer & Hardware, Networking, Security Systems, and E-commerce Platform.

Address: 576-577 Angaria, Hospital Road, Singair, Manikganj | Phone: 01712807642, 01717999424, 01712920237 | Email: systechbdit@gmail.com`;
    
    const sanitizedDescription = DOMPurify.sanitize(hardCodedContent);
    
    const filteredContent = sanitizedDescription
      .replace(/<h1>/g, '<h1 class="text-xl font-bold mb-2">')   
      .replace(/<\/h1>/g, '</h1>')
      .replace(/<h2>/g, '<h2 class="text-lg font-semibold mb-2">') 
      .replace(/<\/h2>/g, '</h2>')
      .replace(/<h3>/g, '<h3 class="text-base font-semibold mb-2">') 
      .replace(/<\/h3>/g, '</h3>')
      .replace(/<h4>/g, '<h4 class="text-sm font-semibold mb-2">') 
      .replace(/<\/h4>/g, '</h4>')
      .replace(/<p>/g, '<p class="mb-3 text-sm leading-relaxed">') 
      .replace(/<\/p>/g, '</p>')
      .replace(/<ul>/g, '<ul class="list-disc pl-5">')  
      .replace(/<\/ul>/g, '</ul>')
      .replace(/<ol>/g, '<ol class="list-decimal pl-5">') 
      .replace(/<\/ol>/g, '</ol>')
      .replace(/<strong>/g, '<strong class="font-bold">')
      .replace(/<\/strong>/g, '</strong>');
      
  return (
    <>
      {/* Original dynamic data - commented out */}
      {/* {description?.data[0]?.whyKry && ( */}
        <section className="max-w-[1650px] px-3 mx-auto py-5">
          <div className="prose prose-sm prose-headings:font-bold prose-headings:mt-3 prose-ul:list-disc prose-ol:list-decimal max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: filteredContent }}
              className="w-full [&_img]:w-full [&_img]:h-auto"
            />
          </div>
        </section>
      {/* )} */}
    </>
  )
}

export default HomepageDescription;