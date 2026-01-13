const PreOrderPolicy = () => {
    return (
      <div className="max-w-4xl mx-auto p-10 bg-white shadow-lg rounded-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          KRY International Pre-Order Policy
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          At KRY International, we strive to provide a seamless and transparent pre-order experience for our customers. Please read the following carefully to understand our updated pre-order policy:
        </p>
  
        {/* Pre-Order Eligibility */}
        <h2 className="text-xl font-semibold text-gray-700 mb-3">1. Pre-Order Eligibility</h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-2">
          <li>Customers must contact KRY International’s sales team or our dedicated hotline to initiate the pre-order process.</li>
          <li>A minimum payment of 50% of the product price is required to confirm a pre-order.</li>
          <li>Pre-orders are subject to the terms and conditions of KRY International, ensuring clarity and mutual understanding.</li>
        </ol>
  
        {/* Pre-Order Process */}
        <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">2. Pre-Order Process</h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-2">
          <li>Once the pre-order payment is confirmed, the product delivery timeline will be within 10 to 15 working days.</li>
          <li>In case of unavailability in the national or international market, the timeline may extend, and customers will be informed accordingly.</li>
          <li>
            <strong>Price Confirmation:</strong>
            <ul className="list-disc list-inside ml-6">
              <li>For high-demand products like the latest iPhone series, the final price will be communicated only after the product has been sourced and is ready for delivery.</li>
              <li>Any variations in price due to region, color, or market factors will be updated to the customer.</li>
            </ul>
          </li>
        </ol>
  
        {/* Refund Policy */}
        <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">3. Refund Policy</h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-2">
          <li>
            <strong>Refundable Pre-Orders:</strong>
            <ul className="list-disc list-inside ml-6">
              <li>Pre-order payments are refundable in cases of product unavailability or cancellation initiated by KRY International.</li>
            </ul>
          </li>
          <li>Once the customer has confirmed the price and delivery method, refund claims will not be entertained.</li>
        </ol>
  
        {/* Delivery Conditions */}
        <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">4. Delivery Conditions</h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-2">
          <li>Delivery of pre-booked items will be completed as per the agreed timeline and terms.</li>
          <li>Customers must provide valid contact details and ensure timely communication with our team for a smooth delivery process.</li>
        </ol>
  
        {/* Terms and Conditions */}
        <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">5. Terms and Conditions</h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-2">
          <li>Pre-order products are covered under the standard KRY International Warranty Policy.</li>
          <li>
            Prices are subject to change based on:
            <ul className="list-disc list-inside ml-6">
              <li>Regional and international market fluctuations.</li>
              <li>Currency exchange rates.</li>
              <li>Specific product attributes like color, variant, or limited-edition availability.</li>
            </ul>
          </li>
          <li>Pre-ordering does not guarantee product availability; however, KRY International will prioritize fulfilling confirmed orders.</li>
          <li>In case of delays due to unforeseen circumstances, KRY International will notify customers in advance and offer flexible options, including extended timelines or refunds.</li>
        </ol>
      </div>
    );
  };
  
  export default PreOrderPolicy;