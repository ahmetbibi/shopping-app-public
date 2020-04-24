import { Menu, Container, Image, Icon } from 'semantic-ui-react';
// To get the route info (useRouter), To get the Router for progress bar (Router)
import Router, { useRouter } from 'next/router';
// To use progress bar from nprogress package
import NProgress from 'nprogress';
// To navigate to the pages
import Link from 'next/link';
import { handleLogout } from '../../utils/auth';

Router.onRouteChangeStart = () => NProgress.start(); // Route change start time
Router.onRouteChangeComplete = () => NProgress.done(); // Route change finish time
Router.onRouteChangeError = () => NProgress.done(); // In case of error, finish the progress

function Header({ user }) {
  // console.log(user);

  const isRoot = user && user.role === 'root';
  const isAdmin = user && user.role === 'admin';
  const isRootOrAdmin = isRoot || isAdmin;

  // Use useRouter hook at the top, to get the path info
  const router = useRouter();
  // Create a helper function
  function isActive(route) {
    // If route is equal to pathname return true, otherwise return false
    return route === router.pathname;
  }

  // Hard coded user value for login action
  // const user = false;

  return (
    <Menu stackable fluid id='menu' inverted>
      <Container text>
        <Link href='/'>
          <Menu.Item header active={isActive('/')}>
            <Image size='mini' src='/static/logo.svg' style={{ marginRight: '1em' }} />
            ReactReserve
          </Menu.Item>
        </Link>
        <Link href='/cart'>
          <Menu.Item header active={isActive('/cart')}>
            <Icon name='cart' size='large' />
            Cart
          </Menu.Item>
        </Link>

        {isRootOrAdmin && (
          <Link href='/create'>
            <Menu.Item header active={isActive('/create')}>
              <Icon name='add square' size='large' />
              Create
            </Menu.Item>
          </Link>
        )}

        {user ? (
          <>
            <Link href='/account'>
              <Menu.Item header active={isActive('/account')}>
                <Icon name='user' size='large' />
                Account
              </Menu.Item>
            </Link>

            <Menu.Item onClick={handleLogout} header>
              <Icon name='sign out' size='large' />
              Logout
            </Menu.Item>
          </>
        ) : (
          <>
            <Link href='/login'>
              <Menu.Item header active={isActive('/login')}>
                <Icon name='sign in' size='large' />
                Login
              </Menu.Item>
            </Link>

            <Link href='/signup'>
              <Menu.Item header active={isActive('/signup')}>
                <Icon name='signup' size='large' />
                Signup
              </Menu.Item>
            </Link>
          </>
        )}
      </Container>
    </Menu>
  );
}

export default Header;
