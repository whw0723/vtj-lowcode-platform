export default {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    ws: true
  },
  '/Manage': {
    target: 'http://192.168.80.79:8000',
    changeOrigin: true,
    ws: true,
    secure: false,
    rewrite: (path: string) => path.replace(/^\/Manage/, '/Manage')
  }
};
