const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Express v5 routing experiment server running on port ${PORT}`);
  console.log('Testing routes:');
  console.log('  GET /users');
  console.log('  GET /users/:id');
  console.log('  GET /users/:id/contents');
  console.log('  GET /users/:id/contents/:contentId');
});
