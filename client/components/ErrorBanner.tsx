import { RequestError } from './types';

interface Props {
  errors: RequestError[];
}

const ErrorBanner = ({ errors }: Props): JSX.Element => {
  return (
    <div className='alert alert-danger mt-3' role='alert'>
      <h4>Ooops... something went wrong</h4>
      <ul className='my-0'>
        {errors.map((err) => (
          <li key={err.message}>{err.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorBanner;
