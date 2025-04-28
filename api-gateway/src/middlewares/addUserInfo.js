const addUserInfoToProxyRequest = (req, res, next) => {
  if (req.user) {
    req.headers["X-User-Info"] = JSON.stringify(req.user);
  }
  next();
};

export default addUserInfoToProxyRequest;
