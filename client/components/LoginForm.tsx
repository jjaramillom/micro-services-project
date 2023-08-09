import { ChangeEvent, useState } from 'react';

import { RequestError } from './types';
import ErrorBanner from './ErrorBanner';

interface Props {
  type: 'login' | 'signUp';
  onSubmit: (email: string, password: string) => void;
  errors: RequestError[] | null;
}

const actionsMap: Record<Props['type'], string> = {
  login: 'Log in',
  signUp: 'Sign up',
};

const LoginForm = ({ type, onSubmit, errors }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (evt: ChangeEvent<HTMLFormElement>) => {
    evt?.preventDefault();
    onSubmit(email, password);
  };

  const action = actionsMap[type];

  return (
    <form onSubmit={submit}>
      <h1>{action}</h1>
      <div className='form-group mt-2'>
        <label>Email address</label>
        <input
          value={email}
          onChange={(evt) => setEmail(evt.target.value)}
          type='email'
          className='form-control'
        />
      </div>
      <div className='form-group mt-2'>
        <label>Password</label>
        <input
          value={password}
          onChange={(evt) => setPassword(evt.target.value)}
          type='password'
          className='form-control'
        />
      </div>
      <button className='btn btn-primary mt-2'>{action}</button>
      {errors && <ErrorBanner errors={errors} />}
    </form>
  );
};

export default LoginForm;
