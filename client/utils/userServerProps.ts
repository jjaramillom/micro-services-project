import { GetServerSideProps } from 'next';
import { User } from '../types';
import { serverAxios } from './axios';

const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let user: User | null;
  try {
    const res = await serverAxios.get('/users/current', {
      headers: { Cookie: req.headers.cookie },
    });
    user = res.data;
  } catch (error) {
    user = null;
  }
  return { props: { user } };
};

export default getServerSideProps;
