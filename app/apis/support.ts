import axios from "axios";

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

export async function uploadSupportMedia(mediaFile: File): Promise<string | null> {
  const url = 'https://api.cloudinary.com/v1_1/tractrac-global/upload';
  const formData = new FormData();

  formData.append('upload_preset', 'dswdebju'); // Your unsigned preset
  formData.append('file', mediaFile);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Cloudinary Response:', data);
      return data.secure_url;
    } else {
      console.error('Upload failed with status:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
}
