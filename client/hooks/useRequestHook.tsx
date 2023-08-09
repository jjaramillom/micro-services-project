import { useState } from 'react';
import { clientAxios } from '../utils/axios';
import { RequestError } from '../components/types';

const useRequestHook = (
  path: string,
  method: 'post' | 'get' | 'patch'
): {
  triggerRequest: (
    body?: Record<string, any>,
    headers?: Record<string, string>
  ) => Promise<any>;
  errors: RequestError[] | null;
} => {
  const [errors, setErrors] = useState<RequestError[] | null>(null);
  const triggerRequest = async (
    body?: Record<string, any>,
    headers?: Record<string, string>
  ) => {
    try {
      const res = await clientAxios[method](path, body, { headers });
      return res.data;
    } catch (error) {
      setErrors((error as any).response.data.errors);
      throw error;
    }
  };

  return {
    triggerRequest,
    errors,
  };
};

export default useRequestHook;
