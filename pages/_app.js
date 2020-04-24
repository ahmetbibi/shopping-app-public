import App from 'next/app';
import Layout from '../components/_App/Layout';
import { parseCookies, destroyCookie } from 'nookies';
import { redirectUser } from '../utils/auth';
import baseUrl from '../utils/baseUrl';
import axios from 'axios';
import Router from 'next/router';

// This App class is executed on the server
// It's executed before anything else
// It's executed for every page changes
class MyApp extends App {
  // Static methods can be accessed outside the component
  static async getInitialProps({ Component, ctx }) {
    // We get cookies from ctx object, this must be executed at the top of the getInitialProps
    const { token } = parseCookies(ctx);
    let pageProps = {};

    // If the component has initial props
    // Calls for each of the get initial props functions for our page components
    if (Component.getInitialProps) {
      // ctx provides additional info about req, res, current route etc.
      pageProps = await Component.getInitialProps(ctx);
    }

    if (!token) {
      const isProtectedRoute = ctx.pathname === '/account' || ctx.pathname === '/create';
      if (isProtectedRoute) {
        redirectUser(ctx, '/login');
      }
    } else {
      try {
        const payload = { headers: { Authorization: token } };
        const url = `${baseUrl}/api/account`;
        // We can pass the headers as a second argument to a get request
        const response = await axios.get(url, payload);

        console.log('response', response);

        const user = response.data;
        const isRoot = user.role === 'root';
        const isAdmin = user.role === 'admin';

        const isNotPermitted = !(isRoot || isAdmin) && ctx.pathname === '/create';
        if (isNotPermitted) {
          redirectUser(ctx, '/');
        }
        // We pass the user data to our page props
        pageProps.user = user;
      } catch (error) {
        console.error('Error getting current user ', error);
        // 1- Throw out the invalid token
        destroyCookie(ctx, 'token');
        // 2- Redirect to Login page
        redirectUser(ctx, '/login');
      }
    }

    // Shorthand syntax for { pageProps: pageProps }
    return { pageProps };
  }

  componentDidMount() {
    window.addEventListener('storage', this.syncLogout);
  }

  syncLogout = (event) => {
    if (event.key === 'logout') {
      // console.log('Logged out from storage');
      Router.push('/login');
    }
  };

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default MyApp;
