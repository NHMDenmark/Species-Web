import KeyCloak from 'keycloak-js';

const keycloak = new KeyCloak({
    url: "https://integration.bhsi.xyz",
    realm: "dassco",
    clientId: "test-species",
    });

export default keycloak;