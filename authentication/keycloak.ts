import KeyCloak from 'keycloak-js';

const keycloak = new KeyCloak({
    url: process.env.NEXT_PUBLIC_KC_URL,
    realm: process.env.NEXT_PUBLIC_KC_REALM,
    clientId: process.env.NEXT_PUBLIC_KC_CLIENTS!.split(',')[0], // Use the first client for initialization
    });

export default keycloak;