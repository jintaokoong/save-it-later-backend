const parseBearerToken = (authorization: string): [Error | undefined, string] => {
  const arr = authorization.split(' ');
  if (arr.length !== 2) {
    return [new Error('malformed header'), ''];
  }
  if (arr[0] !== 'Bearer') {
    return [new Error('malformed header'), ''];
  }
  
  return [undefined, arr[1]];
}

const HttpUtils = {
  parseBearerToken,
}

export default HttpUtils;