import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { UserProvider } from './dashboard/Context/UserContext';

const RedirectOnDynamicLink = () => {
  const router = useRouter();

  useEffect(() => {
    const handleNavigation = (event) => {
      const { location } = event;

      // Check if the user is trying to access any part of the website
      // and redirect them to the signup page if they are not logged in
      if (!isAuthenticated() && !location.pathname.toLowerCase().includes('/signup')) {
        router.push('/signup');
        event.preventDefault();
      }
    };

    // Add event listener to handle browser navigation
    window.addEventListener('popstate', handleNavigation);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, [router]);

  return null; // This component does not render anything
};

function MyApp({ Component, pageProps }) {
  return (
    <>
    <UserProvider >
      <RedirectOnDynamicLink />
      <Component {...pageProps} />
    </UserProvider>
      
    </>
  );
}

// A simple function to check if the user is authenticated
const isAuthenticated = () => {
  // Implement your authentication logic here
  const token = cookie.get('token'); // Example: Check if a token exists in cookies
  return !!token;
//   const user = sessionStorage.getItem('user'); // Example: Check if a user object exists in session storage
//   return !!user;
//   const token = localStorage.getItem('token'); // Example: Check if a token exists in local storage
//   return !!token;
  // For example, you can check if the user is logged in using session, cookies, or any other authentication mechanism
 // Replace with your authentication logic
};

export default MyApp;
export { isAuthenticated };
