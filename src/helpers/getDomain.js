import { isProduction } from "./isProduction";

/**
 * This helper function returns the current domain of the API.
 * If the environment is production, the production App Engine URL will be returned.
 * Otherwise, the link localhost:8080 will be returned (Spring server default port).
 * @returns {string}
 */
export const getDomain = () => {
  const prodUrl = "https://sopra-fs24-group-17-server.oa.r.appspot.com"; // TODO: insert your prod url for server (once deployed)
  const devUrl = "http://localhost:8765";

  return isProduction() ? prodUrl : devUrl;
};

export const getDomainWS = () => {
  const prodUrlWS = "ws://sopra-fs24-group-17-server.oa.r.appspot.com";
  const devUrlWS = "ws://localhost:8080";

  return isProduction() ? prodUrlWS : devUrlWS;
}
