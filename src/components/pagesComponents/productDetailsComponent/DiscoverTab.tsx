import DOMPurify from "dompurify";
import { useEffect, useRef } from "react";

export default function DiscoverTab({ specification }: any) {
   const contentRef = useRef<HTMLDivElement>(null);
  
    // Configure DOMPurify to preserve needed attributes
    DOMPurify.addHook('afterSanitizeAttributes', function(node) {
      if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
        node.setAttribute('rel', 'noopener noreferrer');
      }
      if (node.tagName === 'TABLE') {
        node.setAttribute('border', '1');
        node.setAttribute('style', 'border-collapse: collapse;');
      }
    });
  
    const sanitizedDescription = DOMPurify.sanitize(specification, {
      ADD_ATTR: ['target', 'border', 'cellpadding', 'cellspacing', 'style'],
      ADD_TAGS: ['iframe', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
    });
  
    // CSS class mapping with enhanced table styling
    const classMap = {
      h1: 'text-2xl font-bold mb-2',
      h2: 'text-xl font-semibold mb-2',
      h3: 'text-lg font-semibold mb-2',
      h4: 'text-base font-semibold mb-2',
      p: 'mb-4 text-base leading-relaxed',
      ul: 'list-disc pl-5',
      ol: 'list-decimal pl-5',
      a: 'text-blue-600 hover:underline',
      img: 'w-full h-auto my-4',
      table: 'min-w-full border border-gray-300 mb-4', // Added explicit border
      thead: 'bg-gray-50',
      th: 'px-4 py-2 text-left text-sm font-medium text-gray-700 border border-gray-300', // Added border
      td: 'px-4 py-2 text-sm text-gray-700 border border-gray-300', 
      tr: 'hover:bg-gray-50 even:bg-gray-50'
    };
  
    const processHTML = (html: string) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
  
      Object.keys(classMap).forEach(tag => {
        const elements = tempDiv.getElementsByTagName(tag);
        Array.from(elements).forEach(el => {
          // Preserve existing classes while adding new ones
          const existingClasses = el.className.split(' ').filter(Boolean);
          const newClasses = classMap[tag as keyof typeof classMap].split(' ').filter(Boolean);
          el.className = [...new Set([...existingClasses, ...newClasses])].join(' ');
  
          // Special handling for tables
          if (tag === 'table') {
            el.setAttribute('border', '1');
            el.setAttribute('style', 'border-collapse: collapse;');
            
            // Ensure responsive wrapper
            if (!el.parentElement?.classList.contains('table-wrapper')) {
              const wrapper = document.createElement('div');
              wrapper.className = 'table-wrapper overflow-x-auto';
              el.parentNode?.insertBefore(wrapper, el);
              wrapper.appendChild(el);
            }
          }
        });
      });
  
      return tempDiv.innerHTML;
    };
  
    const processedContent = processHTML(sanitizedDescription);
  
    // Ensure tables remain properly formatted after hydration
    useEffect(() => {
      if (contentRef.current) {
        const tables = contentRef.current.querySelectorAll('table');
        tables.forEach(table => {
          // Ensure border attributes
          if (!table.hasAttribute('border')) {
            table.setAttribute('border', '1');
          }
          if (!table.getAttribute('style')?.includes('border-collapse')) {
            table.setAttribute('style', 'border-collapse: collapse;');
          }
  
          // Ensure responsive wrapper
          if (!table.parentElement?.classList.contains('table-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-wrapper overflow-x-auto';
            table.parentNode?.insertBefore(wrapper, table);
            wrapper.appendChild(table);
          }
        });
      }
    }, [processedContent]);

  return (
    <div className="border rounded-lg p-1.5 md:p-4 pb-10 bg-white shadow-md">
      <h2 className="text-xl lg:text-2xl mb-5 font-semibold text-primary border-b-2 border-primary tracking-wider pb-2">
        Specification
      </h2>
      {/* Wrap in prose and apply styles to images */}
      <div className="prose prose-lg prose-headings:font-bold prose-headings:mt-4 prose-ul:list-disc prose-ol:list-decimal max-w-none">
        <div
          dangerouslySetInnerHTML={{ __html: processedContent }}
          className="w-full [&_img]:w-full [&_img]:h-auto"
        />
      </div>
    </div>
  );
}


