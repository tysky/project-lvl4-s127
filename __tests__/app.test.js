import faker from 'faker';
import matchers from 'jest-supertest-matchers';
import request from 'supertest';

import app from '../src';

const user = {
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: faker.internet.password(),
};

const userUpdate = {
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: faker.internet.password(),
};

describe('requests', () => {
  let server;

  beforeAll(() => {
    jasmine.addMatchers(matchers);
  });

  beforeEach(() => {
    server = app().listen();
  });

  it('GET 200', async () => {
    const res = await request.agent(server)
      .get('/');
    expect(res).toHaveHTTPStatus(200);
  });

  it('GET 404', async () => {
    const res = await request.agent(server)
      .get('/wrong-path');
    expect(res).toHaveHTTPStatus(404);
  });

  afterEach((done) => {
    server.close();
    done();
  });
});

describe('session', () => {
  let server;

  beforeAll(() => {
    jasmine.addMatchers(matchers);
  });

  beforeEach(() => {
    server = app().listen();
  });

  it('GET /session/new', async () => {
    const res = await request.agent(server)
      .get('/session/new');
    expect(res).toHaveHTTPStatus(200);
  });


  it('GET /session/new', async () => {
    const res = await request.agent(server)
      .get('/users/new');
    expect(res).toHaveHTTPStatus(200);
  });

  it('Sign up', async () => {
    const res = await request.agent(server)
      .post('/users')
      .type('form')
      .send({ form: { ...user } });
    expect(res).toHaveHTTPStatus(302);
  });

  it('Sign in', async () => {
    const res = await request.agent(server)
      .post('/session')
      .type('form')
      .send({ form: { ...user } });
    expect(res).toHaveHTTPStatus(302);
  });

  it('Sign out', async () => {
    const res = await request.agent(server)
      .post('/session')
      .type('form')
      .send({ form: { ...user } });
    expect(res).toHaveHTTPStatus(302);

    const res2 = await request.agent(server)
      .delete('/session');
    expect(res2).toHaveHTTPStatus(302);
  });

  afterEach((done) => {
    server.close();
    done();
  });
});

describe('users', () => {
  let server;

  beforeAll(() => {
    jasmine.addMatchers(matchers);
  });

  beforeEach(() => {
    server = app().listen();
  });

  it('GET 200', async () => {
    const res = await request.agent(server)
      .get('/users');
    expect(res).toHaveHTTPStatus(200);
  });

  it('GET 200 /user/1', async () => {
    const res = await request.agent(server)
      .get('/user/1');
    expect(res).toHaveHTTPStatus(200);
  });

  it('GET 200 /user/1/edit', async () => {
    const res = await request.agent(server)
      .get('/user/1/edit');
    expect(res).toHaveHTTPStatus(200);
  });

  it('Update user', async () => {
    const res = await request.agent(server)
      .post('/session')
      .type('form')
      .send({ form: { ...user } });
    expect(res).toHaveHTTPStatus(302);

    const res2 = await request.agent(server)
      .patch('/user/1')
      .type('form')
      .send({ ...userUpdate });
    expect(res2).toHaveHTTPStatus(302);
  });

  it('Delete user', async () => {
    const res = await request.agent(server)
      .post('/session')
      .type('form')
      .send({ form: { ...user } });
    expect(res).toHaveHTTPStatus(302);

    const res2 = await request.agent(server)
      .delete('/user/1')
      .type('form')
      .send({ ...user });
    expect(res2).toHaveHTTPStatus(302);
  });


  afterEach((done) => {
    server.close();
    done();
  });
});
