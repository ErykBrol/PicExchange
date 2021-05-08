const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
   app.use(
      ['/images', '/auth'],
      createProxyMiddleware({
         target: 'http://localhost:5000',
      })
   );
};
