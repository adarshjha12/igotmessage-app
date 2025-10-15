import express from 'express';
import passport from 'passport';
import '../../services/googleOauth';
import { handleGoogleRedirect } from '../controllers/googleOauthController';

const gAuthRouter = express.Router();

gAuthRouter.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    accessType: 'offline',
    prompt: 'consent',
  })
);

gAuthRouter.get(
  '/auth/callback/redirect',
  passport.authenticate('google', { session: false }),
  handleGoogleRedirect
);

export default gAuthRouter;
