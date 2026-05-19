// export const environment = {
//   production: false,
//   apiUrl: (window as any).__env?.apiUrl || 'http://localhost:8080/api/v1',
// };

export const environment = {
  production: true,
  apiUrl: (window as any).__env?.apiUrl || 'https://api.vcccardads.com/api/v1',
};
