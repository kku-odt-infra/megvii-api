const requestToCurl = (config) => {
    const { method = 'GET', baseURL = '', url, headers = {}, data } = config;
    const fullUrl = `${baseURL}${url}`;
    
    let curl = `curl -X ${method.toUpperCase()} '${fullUrl}'`;
    
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        curl += ` \\\n  -H '${key}: ${value}'`;
      });
    }
    
    if (data) {
      curl += ` \\\n  -d '${JSON.stringify(data)}'`;
    }
    
    return curl;
  };
  
  module.exports = { requestToCurl };