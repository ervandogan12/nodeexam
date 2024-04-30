import request from 'supertest';
import app from '../app';


describe('POST /users/register', () => {
  it('should return HTTP success with valid request', async () => {
      const res = await request(app)
          .post('/users/register')
          .send({ email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(200);
  });
});


describe('POST /users/register', () => {
  it('should return HTTP error with invalid request', async () => {
      const res = await request(app)
          .post('/users/register')
          .send({});

      expect(res.statusCode).toEqual(400);
  });
});