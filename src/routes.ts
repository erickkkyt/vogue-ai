import { websiteConfig } from './config/website';

export enum Routes {
  Home = '/',
  App = '/app',
  Dashboard = '/assets',
  Profile = '/profile',
  Billings = '/billings',
  Pricing = '/pricing',
  Login = '/auth/login',
  Register = '/auth/register',
  AuthError = '/auth/error',
  ForgotPassword = '/auth/forgot-password',
  ResetPassword = '/auth/reset-password',
}

export const DEFAULT_LOGIN_REDIRECT =
  websiteConfig.routes.defaultLoginRedirect ?? Routes.App;
