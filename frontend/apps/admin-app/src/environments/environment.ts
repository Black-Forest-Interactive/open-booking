export const environment = {
  production: true,
  logrocket: true,
  logrocketAppId: '0euwfq/open-booking-jcupc',
  logoutUrl: 'https://open.psm.church/',
  keycloak: {
    url: 'https://idp.psm.church/auth',
    realm: 'open-booking',
    clientId: 'admin-app',
  },
  features: {
    errorInterception: false
  }
};
