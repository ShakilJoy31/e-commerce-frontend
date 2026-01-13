
import DOMPurify from "dompurify";
const HomepageDescription = ({description}) => {
    
    const sanitizedDescription = DOMPurify.sanitize(description?.data[0]?.whyKry);
    const filteredContent = sanitizedDescription
      .replace(/<h1>/g, '<h1 class="text-2xl font-bold mb-2">')   
      .replace(/<\/h1>/g, '</h1>')
      .replace(/<h2>/g, '<h2 class="text-xl font-semibold mb-2">') 
      .replace(/<\/h2>/g, '</h2>')
      .replace(/<h3>/g, '<h3 class="text-lg font-semibold mb-2">') 
      .replace(/<\/h3>/g, '</h3>')
      .replace(/<h4>/g, '<h4 class="text-base font-semibold mb-2">') 
      .replace(/<\/h4>/g, '</h4>')
      .replace(/<p>/g, '<p class="mb-4 text-base leading-relaxed">') 
      .replace(/<\/p>/g, '</p>')
      .replace(/<ul>/g, '<ul class="list-disc pl-5">')  
      .replace(/<\/ul>/g, '</ul>')
      .replace(/<ol>/g, '<ol class="list-decimal pl-5">') 
      .replace(/<\/ol>/g, '</ol>');
  return (
    <>{description?.data[0]?.whyKry && <section className="max-w-[1650px] px-3 mx-auto py-5">
        <div className="prose prose-lg prose-headings:font-bold prose-headings:mt-4 prose-ul:list-disc prose-ol:list-decimal max-w-none">
        <div
          dangerouslySetInnerHTML={{ __html: filteredContent }}
          className="w-full [&_img]:w-full [&_img]:h-auto"
        />
      </div>
    </section>}</>
  )
}

export default HomepageDescription
