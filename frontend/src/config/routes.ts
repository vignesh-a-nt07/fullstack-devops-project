import React, { lazy } from 'react';
import Layout from '../components/Layout';

const Login = lazy(() => import('../pages/Login'));
const SignUp = lazy(() => import('../pages/SignUp'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const ProtectedRoute = lazy(() => import('../pages/ProtectedRoute'));
const Users = lazy(() => import('../pages/Users'));
const JobPostPage = lazy(() => import('../pages/JobPostPage'));
const AddJobPost = lazy(() => import('../pages/AddJobPost'));
const AddCandidate = lazy(() => import('../pages/AddCandidate'));
const CandidatesPage = lazy(() => import('../pages/CandidatesPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));

const routes = [
  {
    path: '/login',
    element: React.createElement(Login),
  },
  {
    path: '/signup',
    element: React.createElement(SignUp),
  },
  {
    path: '/',
    element: React.createElement(ProtectedRoute, {
      children: React.createElement(Layout, {
        children: React.createElement(Dashboard),
      }),
    }),
  },
  {
    path: '/users',
    element: React.createElement(ProtectedRoute, {
      children: React.createElement(Layout, {
        children: React.createElement(Users),
      }),
    }),
  },
  {
    path: '/jobposts',
    element: React.createElement(ProtectedRoute, {
      children: React.createElement(Layout, {
        children: React.createElement(JobPostPage),
      }),
    }),
  },
  {
    path: '/jobposts/add',
    element: React.createElement(ProtectedRoute, {
      children: React.createElement(Layout, {
        children: React.createElement(AddJobPost),
      }),
    }),
  },
  {
    path: '/candidates',
    element: React.createElement(ProtectedRoute, {
      children: React.createElement(Layout, {
        children: React.createElement(CandidatesPage),
      }),
    }),
  },
  {
    path: '/candidates/add',
    element: React.createElement(ProtectedRoute, {
      children: React.createElement(Layout, {
        children: React.createElement(AddCandidate),
      }),
    }),
  },
  {
    path: '/settings',
    element: React.createElement(ProtectedRoute, {
      children: React.createElement(Layout, {
        children: React.createElement(SettingsPage),
      }),
    }),
  },
];

export default routes;
