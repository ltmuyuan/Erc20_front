import httpRequest from "../utils/request";


export function apiSynchronous() {
  return httpRequest({
    url: `/absc/nft/synchronous`,
    method: "get",
  });
}

export function apiGetNFTByOwner(address) {
  return httpRequest({
    url: `/absc/nft`,
    method: "get",
    params: {address:address},
  });
}