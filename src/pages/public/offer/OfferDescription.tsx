import DOMPurify from "dompurify";
const OfferDescription = ({ details, condition }: any) => {
  const sanitizedDescription = DOMPurify.sanitize(details);
  const sanitizedCondition = DOMPurify.sanitize(condition);
  const filteredContent = sanitizedDescription
    .replace(/<h1>/g, '<h1 class="text-2xl font-bold mb-2">')
    .replace(/<\/h1>/g, "</h1>")
    .replace(/<h2>/g, '<h2 class="text-xl font-semibold mb-2">')
    .replace(/<\/h2>/g, "</h2>")
    .replace(/<h3>/g, '<h3 class="text-lg font-semibold mb-2">')
    .replace(/<\/h3>/g, "</h3>")
    .replace(/<h4>/g, '<h4 class="text-base font-semibold mb-2">')
    .replace(/<\/h4>/g, "</h4>")
    .replace(/<p>/g, '<p class="mb-4 text-base leading-relaxed">')
    .replace(/<\/p>/g, "</p>")
    .replace(/<ul>/g, '<ul class="list-disc pl-5">')
    .replace(/<\/ul>/g, "</ul>")
    .replace(/<ol>/g, '<ol class="list-decimal pl-5">')
    .replace(/<\/ol>/g, "</ol>");
  const filteredCondition = sanitizedCondition
    .replace(/<h1>/g, '<h1 class="text-2xl font-bold mb-2">')
    .replace(/<\/h1>/g, "</h1>")
    .replace(/<h2>/g, '<h2 class="text-xl font-semibold mb-2">')
    .replace(/<\/h2>/g, "</h2>")
    .replace(/<h3>/g, '<h3 class="text-lg font-semibold mb-2">')
    .replace(/<\/h3>/g, "</h3>")
    .replace(/<h4>/g, '<h4 class="text-base font-semibold mb-2">')
    .replace(/<\/h4>/g, "</h4>")
    .replace(/<p>/g, '<p class="mb-4 text-base leading-relaxed">')
    .replace(/<\/p>/g, "</p>")
    .replace(/<ul>/g, '<ul class="list-disc pl-5">')
    .replace(/<\/ul>/g, "</ul>")
    .replace(/<ol>/g, '<ol class="list-decimal pl-5">')
    .replace(/<\/ol>/g, "</ol>");
  return (
    <div className="px-2 lg:px-5">
      <div>
        {details && (
          <div className="prose prose-headings:font-bold prose-ul:list-disc prose-ol:list-decimal max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: filteredContent }}
              className="w-full [&_img]:w-full [&_img]:h-auto"
            />
          </div>
        )}
      </div>
      <div className="mt-5">
        {condition && (
          <div className="prose prose-headings:font-bold prose-ul:list-disc prose-ol:list-decimal max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: filteredCondition }}
              className="w-full [&_img]:w-full [&_img]:h-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferDescription;
