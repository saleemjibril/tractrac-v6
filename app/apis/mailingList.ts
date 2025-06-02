// app/api/subscribe/route.ts
import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

interface SubscribeRequest {
  email: string;
}

interface MailerLiteSubscriber {
  email: string;
  status: 'active' | 'unconfirmed';
  fields?: {
    name?: string;
    last_name?: string;
    [key: string]: any;
  };
  groups?: string[];
}

interface MailerLiteErrorResponse {
  message: string;
  errors?: any;
}

export async function subscribeUser(email: string) {
  // try {


    const subscriberData: MailerLiteSubscriber = {
      email: email,
      status: 'active', // or 'unconfirmed' if you want double opt-in
      // You can add more fields here like:
      // fields: {
      //   name: 'John Doe',
      //   last_name: 'Doe'
      // },
      // groups: ['group_id'] // if you want to add to specific groups
    };

    const response = await axios.post(
      'https://connect.mailerlite.com/api/subscribers',
      subscriberData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_MAILERLITE_API_KEY}`,
          'Accept': 'application/json',
        },
      }
    );

    return response;

  // } 
  // catch (error) {
  //   console.log('MailerLite subscription error:', error);

  //   // Handle Axios errors
  //   if (axios.isAxiosError(error)) {
  //     const axiosError = error as AxiosError<MailerLiteErrorResponse>;
      
  //     if (axiosError.response) {
  //       const { status, data } = axiosError.response;
        
  //       // Handle MailerLite API errors
  //       if (data?.message && data.message.includes('already exists')) {
  //         return NextResponse.json(
  //           {
  //             status: 'error',
  //             message: 'This email is already subscribed to our newsletter.'
  //           },
  //           { status: 400 }
  //         );
  //       }
        
  //       return NextResponse.json(
  //         {
  //           status: 'error',
  //           message: data?.message || 'Failed to subscribe. Please try again.'
  //         },
  //         { status: status }
  //       );
  //     }
  //   }

  //   // Network or other errors
  //   return NextResponse.json(
  //     {
  //       status: 'error',
  //       message: 'Internal server error. Please try again later.'
  //     },
  //     { status: 500 }
  //   );
  // }
}