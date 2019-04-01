let apiRoot = window.location.hostname === 'localhost' 
    ? 'http://localhost:8080'
     : 'http://localhost:8080';

export default {
    apiRoot: apiRoot
};