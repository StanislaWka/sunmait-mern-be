export const API_ROUTE = '/api/v1';

// Users region
export const USERS_ROUTE = `${API_ROUTE}/users`;

export const USER_ROUTES = {
  MAIN: '/',
  REGISTRATION: '/registration',
  LOGIN: '/login',
};

// Posts region

export const POSTS_ROUTE = `${API_ROUTE}/posts`;

export const POST_ROUTE = {
  MAIN: '/',
  MAIN_WITH_ID: '/:id',
};
