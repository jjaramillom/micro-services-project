import 'bootstrap/dist/css/bootstrap.css';
import { type AppType } from 'next/app';

const App: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default App;
