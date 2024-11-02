'use client'
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string>('Loading...');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
    //   console.log(token);
    //   console.log(token);
      

      if (token) {
        try {
          const response = await axios.get(`http://localhost:5000/api/auth/verify-email?token=${token}`);
          console.log(response.data);
          
          setMessage(response.data.message || 'Email verified successfully! Redirecting to login...');
          setTimeout(() => {
            window.location.href = '/login';  // Use window.location.href to handle redirects in the App Router
          }, 2000);
        } catch (error) {
          setMessage('Verification failed. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        setMessage('Invalid or missing token.');
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div>
      {loading ? <p>Loading...</p> : <p>{message}</p>}
    </div>
  );
};

export default VerifyEmail;
