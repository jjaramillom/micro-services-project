import express from 'express';
import { getCurrentUser } from '../controllers/usersController';
import { jwtAuthentication } from '@jjaramillom-tickets/common';


const router = express.Router();

router.get('/api/users/current', jwtAuthentication, getCurrentUser);

export default router;
