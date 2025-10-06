/**
 * Utility function to extract error messages from API responses
 * Handles 422 validation errors with nested detail structure
 * @param error - The error object from catch block
 * @param fallbackMessage - Default message if no specific error is found
 * @returns Extracted error message
 */
export const getErrorMessage = (error: any, fallbackMessage: string = "An unexpected error occurred"): string => {
  // Handle 422 validation errors with nested detail structure
  if (error?.response?.status === 422) {
    const detail = error?.response?.data?.detail;
    if (Array.isArray(detail) && detail.length > 0) {
      const firstError = detail[0];
      const fieldName = firstError?.loc && firstError.loc.length > 1 
        ? firstError.loc[firstError.loc.length - 1] // Get the last element (field name)
        : null;
      
      const message = firstError?.msg || fallbackMessage;
      
      // Format field name for display (convert snake_case to Title Case)
      const formattedFieldName = fieldName 
        ? fieldName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : null;
      
      return formattedFieldName 
        ? `${formattedFieldName}: ${message}`
        : message;
    } else if (typeof detail === 'string') {
      return detail;
    }
  }
  
  // For other errors, use the existing logic
  return error?.response?.data?.detail || error?.response?.data?.message || fallbackMessage;
};

/**
 * Utility function to handle errors in catch blocks with toast notifications
 * @param error - The error object from catch block
 * @param toast - Toast function for displaying errors
 * @param fallbackMessage - Default message if no specific error is found
 */
export const handleApiError = (error: any, toast: any, fallbackMessage: string = "An unexpected error occurred") => {
  const errorMessage = getErrorMessage(error, fallbackMessage);
  toast.error(errorMessage);
  console.log("API Error:", error);
  return errorMessage;
};
