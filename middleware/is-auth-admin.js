module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
      return res.redirect('/login3');
    }
    next();
  };
  