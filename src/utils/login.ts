export const getLoginUrl = (): string => {
  const backendUrl = import.meta.env.VITE_AUTH_URL;
  const url = window.location.href;
  const next = encodeURIComponent(url);
  const loginUrl = `${backendUrl}/login/?next=${next}`;
  return loginUrl;
};

export const getRawLoginUrl = (): string => {
  const backendUrl = import.meta.env.VITE_AUTH_URL;
  const loginUrl = `${backendUrl}/login/`;
  return loginUrl;
};

export const getRegisterUrl = (): string => {
  return `${import.meta.env.VITE_AUTH_URL}/auth/user/register/`;
};
