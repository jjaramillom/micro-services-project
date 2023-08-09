import { useRouter } from 'next/router';

import useRequestHook from '../../hooks/useRequestHook';
import LoginForm from '../../components/LoginForm';
import Header from '../../components/Header';
import { User } from '../../types';

interface Props {
  user: User | null;
}

const SignUp = ({ user }: Props) => {
  const router = useRouter();
  const { triggerRequest, errors } = useRequestHook('/users/signup', 'post');

  const handleSubmit = async (email: string, password: string) => {
    try {
      const res = await triggerRequest({ email, password });
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

export default SignUp;
export { default as getServerSideProps } from '../../utils/userServerProps';
