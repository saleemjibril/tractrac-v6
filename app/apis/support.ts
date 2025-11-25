import axios from "axios";
import secureLocalStorage from 'react-secure-storage';

export const createSupportTicket = async (data: object, token: string) => {

  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/support/tickets`,
    data,
    config
  );

  return res;
};

export const getUserSupportTickets = async (token: string) => {

  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/support/tickets`,
    config
  );

  return res;
};

export const getUserSupportTicketDetails = async (id: string, token: string) => {

  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/support/tickets/${id}`,
    config
  );

  return res;
};


export const sendSupportTicketMessage = async (id: string, data: object, token: string) => {

  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/support/tickets/${id}/messages`,
    data,
    config
  );

  return res;
};


export const uploadFile = async (id: string, data: object, token: string) => {
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
    `${process.env.NEXT_PUBLIC_URL}/support/tickets/${id}/media`,
    formData, // Send formData instead of JSON
    config
  );

  return res;
};

export async function uploadSupportMedia(mediaFile: File, folder: string = 'images'): Promise<string | null> {
  const BASE_URL = process.env.NEXT_PUBLIC_URL
  const formData = new FormData();

  formData.append('file', mediaFile);
  formData.append('folder', folder);

  try {
    // Get authentication token
    const userToken = secureLocalStorage.getItem("xak") as string;
    const adminToken = secureLocalStorage.getItem("xuk") as string;
    const token = userToken || adminToken;

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/uploads/images`, {
      method: 'POST',
      body: formData,
      headers,
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Image upload response:', data);
      
      // API returns the uploaded image URL as response
      const imageUrl = typeof data === 'string' ? data : data.url || data.data?.url;
      return imageUrl || null;
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('Upload failed with status:', response.status, errorData);
      return null;
    }
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
}
