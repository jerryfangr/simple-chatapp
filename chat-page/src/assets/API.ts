const needCross: boolean = true;

// cross-domain server and same domain server
const BASE_PATH: string = needCross ? 'http://192.168.2.247:39999/' : '/';

const API: {
  [k: string]: string | boolean | number
} = {
  // is cross-domain
  cross: needCross,
  // base url
  base: BASE_PATH,
  // post
  login: BASE_PATH + 'user/login',
  // get
  logout: BASE_PATH + 'user/logout',
}

export default API;