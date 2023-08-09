import { useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequestHook';

const SignOut = () => {
  const { triggerRequest } = useRequest('/users/logout', 'post');

  useEffect(() => {
    (async () => {
      await triggerRequest();
      Router.push('/');
    })();
  }, []);

  return <div>Logging you out...</div>;
};

export default SignOut;
