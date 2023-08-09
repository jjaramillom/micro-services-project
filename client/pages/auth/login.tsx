import { useRouter } from 'next/router';

import useRequestHook from '../../hooks/useRequestHook';
import LoginForm from '../../components/LoginForm';
import Header from '../../components/Header';
import { User } from '../../types';

interface Props {
  user: User | null;
}

const Login = ({ user }: Props) => {
  const router = useRouter();
  const { triggerRequest, errors } = useRequestHook('/users/login', 'post');

  const handleSubmit = async (email: string, password: string) => {
    const credentials = Buffer.from(`${email}:${password}`).toString('base64');
    try {
      await triggerRequest(undefined, { Authorization: `Basic ${credentials}` });
      router.push('/');
    } catch (error) {
      // already handled
    }
  };
  return (
    <>
      <Header user={user} />
      <LoginForm type='login' onSubmit={handleSubmit} errors={errors} />
    </>
  );
};

export default Login;
export { default as getServerSideProps } from '../../utils/userServerProps';
