export const formatErrorMessage = (errorMessage) => {
    if (!errorMessage) return "";
  
    const match = errorMessage.match(/"([^"]+)"/);
    const fieldName = match ? match[1] : errorMessage; 
  
    // Define user-friendly field names
    const fieldMappings = {
      "shippingAddress[0].address": "Shipping address is required.",
      "shippingAddress[0].name": "Recipient name cannot be empty.",
      "shippingAddress[0].city": "City field is required.",
      "shippingAddress[0].thana": "Please enter the Thana name.",
      "shippingAddress[0].district": "Select a valid district.",
      "shippingAddress[0].phone": "Phone number is required.",
      "orderItems[0].productId": "Please select a valid product.",
      "orderItems[0].quantity": "Quantity must be at least 1.",
      "totalAmount": "Total amount cannot be zero.",
      "userId": "User authentication failed. Please log in again.",
    };
  
    // Return the mapped user-friendly message, or a default message
    return fieldMappings[fieldName] || "Something went wrong. Please check your input.";
  };
  