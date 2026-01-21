const request = require('supertest');
const app = require('./app');

describe('Express v5 Routing Experiment', () => {
  describe('GET /users', () => {
    it('should return users list', async () => {
      const response = await request(app)
        .get('/users')
        .expect(200);

      expect(response.body.route).toBe('/users');
      expect(response.body.description).toBe('Users list');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /users/:id', () => {
    it('should return user details for numeric ID', async () => {
      const response = await request(app)
        .get('/users/123')
        .expect(200);

      expect(response.body.route).toBe('/users/:id');
      expect(response.body.description).toBe('User details');
      expect(response.body.userId).toBe('123');
    });

    it('should return user details for string ID "xxxx"', async () => {
      const response = await request(app)
        .get('/users/xxxx')
        .expect(200);

      expect(response.body.route).toBe('/users/:id');
      expect(response.body.description).toBe('User details');
      expect(response.body.userId).toBe('xxxx');
    });

    it('should return user details for ID "contents" (edge case)', async () => {
      const response = await request(app)
        .get('/users/contents')
        .expect(200);

      // This tests whether /users/contents is treated as a user ID or routes to contents
      expect(response.body.route).toBe('/users/:id');
      expect(response.body.description).toBe('User details');
      expect(response.body.userId).toBe('contents');
    });
  });

  describe('GET /users/config (defined AFTER /users/:id)', () => {
    it('should be absorbed by /users/:id route (config is treated as id)', async () => {
      const response = await request(app)
        .get('/users/config')
        .expect(200);

      // Key test: Since /users/config is defined AFTER /users/:id,
      // it should be absorbed by the dynamic route /users/:id
      // and "config" should be treated as the id parameter
      expect(response.body.route).toBe('/users/:id');
      expect(response.body.description).toBe('User details');
      expect(response.body.userId).toBe('config');
    });

    it('should verify /users/config is NOT routed to its own handler', async () => {
      const response = await request(app)
        .get('/users/config')
        .expect(200);

      // This confirms that the /users/config route handler is NOT called
      // because it's absorbed by /users/:id
      expect(response.body.route).not.toBe('/users/config');
      expect(response.body.description).not.toBe('Users Config');
    });
  });

  describe('GET /users/:id/contents', () => {
    it('should return user contents list and NOT be absorbed by /users/:id', async () => {
      const response = await request(app)
        .get('/users/123/contents')
        .expect(200);

      // This is the KEY test - verifying the route is NOT absorbed by /users/:id
      expect(response.body.route).toBe('/users/:id/contents');
      expect(response.body.description).toBe('User contents list');
      expect(response.body.userId).toBe('123');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /users/:id/contents/:contentId', () => {
    it('should return specific user content and NOT be absorbed by other routes', async () => {
      const response = await request(app)
        .get('/users/123/contents/456')
        .expect(200);

      // This tests that the most specific route is matched
      expect(response.body.route).toBe('/users/:id/contents/:contentId');
      expect(response.body.description).toBe('User specific content');
      expect(response.body.userId).toBe('123');
      expect(response.body.contentId).toBe('456');
    });
  });

  describe('Route priority verification', () => {
    it('should demonstrate Express v5 routes to more specific paths', async () => {
      // Test 1: Base list
      const res1 = await request(app).get('/users').expect(200);
      expect(res1.body.route).toBe('/users');

      // Test 2: Simple param
      const res2 = await request(app).get('/users/123').expect(200);
      expect(res2.body.route).toBe('/users/:id');

      // Test 3: Nested path - should NOT be absorbed
      const res3 = await request(app).get('/users/123/contents').expect(200);
      expect(res3.body.route).toBe('/users/:id/contents');

      // Test 4: Double nested path - should NOT be absorbed
      const res4 = await request(app).get('/users/123/contents/456').expect(200);
      expect(res4.body.route).toBe('/users/:id/contents/:contentId');

      console.log('\n=== Express v5 Routing Experiment Results ===');
      console.log('✓ /users → matched correctly');
      console.log('✓ /users/123 → matched /users/:id correctly');
      console.log('✓ /users/123/contents → matched /users/:id/contents (NOT absorbed by /users/:id)');
      console.log('✓ /users/123/contents/456 → matched /users/:id/contents/:contentId correctly');
      console.log('✓ Express v5 routes to more specific paths preferentially!');
    });
  });
});
