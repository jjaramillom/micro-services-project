import axiosLibrary from 'axios';

export const clientAxios = axiosLibrary.create({
  baseURL: '/api',
});

export const serverAxios = axiosLibrary.create({
  // service.namespace
  baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api',
  headers: {
		// For ingress to know how the routing should be made
    Host: 'ticketing.dev',
  },
});
