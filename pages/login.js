import { Form, Segment, Button, Icon, Message } from 'semantic-ui-react';
import Link from 'next/link';
import React from 'react';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import catchErrors from '../utils/catchErrors';
import { handleLogin } from '../utils/auth';

const INITIAL_USER = {
  email: '',
  password: '',
};
function Login() {
  const [user, setUser] = React.useState(INITIAL_USER);
  const [disabled, setDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const isUser = Object.values(user).every(elm => Boolean(elm));
    isUser ? setDisabled(false) : setDisabled(true);
  }, [user]);

  function handleChange(event) {
    const { name, value } = event.target;
    setUser(preState => ({ ...preState, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      // console.log(user);
      const { email, password } = user;
      const url = `${baseUrl}/api/login`;
      const payload = { email, password };
      const response = await axios.post(url, payload);

      handleLogin(response.data);

      // console.log(response);

      // setUser(INITIAL_USER);
    } catch (error) {
      // console.error(error);
      catchErrors(error, setError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Message
        attached
        icon='privacy'
        content='Login with email and password'
        header='Welcome Back!'
        color='blue'
      />
      <Form onSubmit={handleSubmit} loading={loading} error={Boolean(error)}>
        <Message error header='Oops!' content={error} />
        <Segment>
          <Form.Input
            fluid
            placeholder='Email'
            label='Email'
            icon='envelope'
            iconPosition='left'
            name='email'
            value={user.value}
            type='email'
            onChange={handleChange}
          />
          <Form.Input
            fluid
            placeholder='Password'
            label='Password'
            icon='lock'
            iconPosition='left'
            name='password'
            value={user.password}
            type='password'
            onChange={handleChange}
          />
          <Button
            icon='sign in'
            type='submit'
            color='orange'
            content='Login'
            disabled={disabled || loading}
          />
        </Segment>
      </Form>
      <Message>
        <Icon name='help' />
        Existing user?{' '}
        <Link href='/signup'>
          <a>Sign up here</a>
        </Link>{' '}
        instead.
      </Message>
    </>
  );
}

export default Login;
