const express = require('express');
const app = express();

// Define routes in the specified order for the experiment
// 1. GET /users
app.get('/users', (req, res) => {
  res.json({
    route: '/users',
    description: 'Users list',
    data: ['user1', 'user2', 'user3']
  });
});

// 2. GET /users/:id
app.get('/users/:id', (req, res) => {
  res.json({
    route: '/users/:id',
    description: 'User details',
    userId: req.params.id
  });
});

// 3. GET /users/:id/contents
app.get('/users/:id/contents', (req, res) => {
  res.json({
    route: '/users/:id/contents',
    description: 'User contents list',
    userId: req.params.id,
    data: ['content1', 'content2']
  });
});

// 4. GET /users/:id/contents/:contentId
app.get('/users/:id/contents/:contentId', (req, res) => {
  res.json({
    route: '/users/:id/contents/:contentId',
    description: 'User specific content',
    userId: req.params.id,
    contentId: req.params.contentId
  });
});

module.exports = app;
