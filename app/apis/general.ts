import axios from "axios";

export const becomeAgent = async (data: object, token: string) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/agent/become-agent`,
      data,
      config
    );
  
    return res;
  };

export const investInTractor = async (data: object, token: string) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/investor/invest-tractor`,
      data,
      config
    );
  
    return res;
  };

export const registerAsVendor = async (data: object, token: string) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/vendor/tractor-vendor`,
      data,
      config
    );
  
    return res;
  };

export const enlistOperator = async (data: object, token: string) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/operator/register-operator`,
      data,
      config
    );
  
    return res;
  };

export const womenInMech = async (data: object, token: string) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/special_program/women-in-mechanization`,
      data,
      config
    );
  
    return res;
  };


  export const tractorOnboarding = async (data: object, token: string) => {
    console.log("request", data);
    
    // Create a FormData object
    const formData = new FormData();
    
    // Add all properties from data object to the FormData
    Object.entries(data).forEach(([key, value]) => {
      // Handle file objects specially if present
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value instanceof Blob) {
        formData.append(key, value);
      } else if (typeof value === 'object' && value !== null) {
        // Convert objects to JSON strings
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });
    
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', // Set the Content-Type header for form data
      },
    };
  
    // Log FormData entries
    console.log("FormData contents:");
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/special_program/tractor-onboarding`,
      formData, // Send formData instead of JSON
      config
    );
  
    return res;
  };
  

  export const collaborateWithUs = async (data: object, token: string) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/special_program/collaboration`,
      data,
      config
    );
  
    return res;
  };
