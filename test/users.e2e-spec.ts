import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { UsersService } from 'src/modules/users/users.service';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userService: UsersService;
  let token: string; 

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    userService = moduleFixture.get<UsersService>(UsersService);

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ private_nickname: 'pmpz995u@nova.com', password: 'fpj6sq0q' });
    token = res.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users (GET)', () => {
    it('should return all users (ADMIN access)', async () => {
      const res = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should return 401 when no token is provided', async () => {
      const res = await request(app.getHttpServer()).get('/users');
      expect(res.status).toBe(401);
    });
  });

  describe('/users/:id (GET)', () => {
    it('should return user by ID (ADMIN access)', async () => {
      const userId = 1; 
      const res = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', userId);
    });

    it('should return 404 if user is not found', async () => {
      const userId = 9999;
      const res = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });

  describe('/users/me (POST)', () => {
    it('should return the current user info', async () => {
      const res = await request(app.getHttpServer())
        .post('/users/me')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id');
    });

    it('should return 401 if token is not provided', async () => {
      const res = await request(app.getHttpServer()).post('/users/me');
      expect(res.status).toBe(401);
    });
  });

  describe('/users/me (PUT)', () => {
    it('should update current user info', async () => {
      const updateDto = {
        firstName: 'UpdatedName',
        lastName: 'UpdatedLastName',
      };

      const res = await request(app.getHttpServer())
        .put('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send(updateDto);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('firstName', 'UpdatedName');
    });

    it('should return 400 for invalid data', async () => {
      const res = await request(app.getHttpServer())
        .put('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: '' }); 
      expect(res.status).toBe(400);
    });
  });

  describe('/users/:id (PUT)', () => {
    it('should update user by ID (ADMIN access)', async () => {
      const updateDto = {
        role: 'USER',
        email: 'updatedemail@example.com',
      };
      const userId = 1;
      const res = await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateDto);

      expect(res.status).toBe(200);
    });

    it('should return 404 if user is not found', async () => {
      const updateDto = { role: 'USER', email: 'newemail@example.com' };
      const userId = 9999;
      const res = await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateDto);
      expect(res.status).toBe(404);
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('should delete user by ID (ADMIN access)', async () => {
      const userId = 1; 
      const res = await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it('should return 404 if user is not found', async () => {
      const userId = 9999; 
      const res = await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });

  describe('/users/createUser (POST)', () => {
    it('should create a new user', async () => {
      const res = await request(app.getHttpServer())
        .post('/users/createUser')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });
});
