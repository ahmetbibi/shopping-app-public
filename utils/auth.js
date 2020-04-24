import cookie from 'js-cookie';
import Router from 'next/router';

export function handleLogin(token) {
  cookie.set('token', token);
  Router.push('/account');
}

export function redirectUser(ctx, location) {
  // If there is ctx object, it means we are on the server side
  if (ctx.req) {
    // Redirecting with node js in the server side,
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
  } else {
    // If we are on the client side
    Router.push(location);
  }
}

export function handleLogout() {
  cookie.remove('token');
  // To universal logout, set a logout item to local storage and detect it in the frontend side (_app.js)
  window.localStorage.setItem('logout', Date.now());
  Router.push('/login');
}
