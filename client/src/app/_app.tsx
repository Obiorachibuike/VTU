import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { UserProvider } from './dashboard/Context/UserContext';
import cookie from 'js-cookie'; // Make sure this is installed

const RedirectOnDynamicLink = () => {
  const router = useRouter();

  useEffect(() => {
    const handleNavigation = (event: PopStateEvent) => {
      const location = window.location;

      // Redirect to /signup if not authenticated and trying to access other routes
      if (!isAuthenticated() && !location.pathname.toLowerCase().includes('/signup')) {
        router.push('/signup');
        event.preventDefault();
      }
    };

    window.addEventListener('popstate', handleNavigation);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, [router]);

  return null;
};

function MyApp({ Component, pageProps }: any) {
  return (
    <UserProvider>
      <RedirectOnDynamicLink />
      <Component {...pageProps} />
    </UserProvider>
  );
}

// Utility function to check authentication
const isAuthenticated = (): boolean => {
  const token = cookie.get('token');
  return !!token;
};

export default MyApp;
export { isAuthenticated };