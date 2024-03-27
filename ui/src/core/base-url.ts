const baseUrls = {
  dev: {
    reactApp: 'http://localhost:3000',
    proxy: 'http://localhost:3000',
  },
  test: {
    reactApp: 'http://localhost:3000',
    proxy: 'http://localhost:3000',
  },
  production: {
    reactApp: 'http://localhost:3000',
    proxy: 'http://localhost:3000',
  },
};

export const getBaseUrl = () => {
  let baseUrl;

  switch (window.location.origin) {
    case baseUrls.dev.reactApp:
      baseUrl = baseUrls.dev.proxy;
      break;
    case baseUrls.test.reactApp:
      baseUrl = baseUrls.test.proxy;
      break;
    case baseUrls.production.reactApp:
      baseUrl = baseUrls.production.proxy;
      break;
    default:
      baseUrl = baseUrls.test.proxy;
  }

  return baseUrl;
};
