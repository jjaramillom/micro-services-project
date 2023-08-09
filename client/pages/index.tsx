import Header from '../components/Header';
import { User } from '../types';
interface Props {
  user: User | null;
}

const Home = ({ user }: Props) => {
  return (
    <>
      <Header user={user} />
      {user ? <h1>You are signed in</h1> : <h1>You are NOT signed in</h1>}
    </>
  );
};

export default Home;
export { default as getServerSideProps } from '../utils/userServerProps';
