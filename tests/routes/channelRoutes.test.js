const request = require('supertest');
const express = require('express');
const db = require('../../models/channelModel');
const app = express();

const router = require('../../routes/channelRoutes');
app.use(router);

describe('[Integration]: List all channels', () => {
  test('Without setting db', () => {
    return request(app).get('/').expect(500);
  });

  test('With correct db', () => {
    db.setDB([]);
    return request(app).get('/').expect(200);
  });
});

describe('[Integration]: Get one channel', () => {
  test('Channel exists', () => {
    db.setDB([{ name: 'C1', url: 'url1' }]);
    return request(app).get('/url1').expect(200);
  });

  test('Channel does not exists', () => {
    db.setDB([{ name: 'C1', url: 'url1' }]);
    return request(app).get('/u4').expect(400);
  });
});

describe('[Integration]: Add a channel', () => {
  test('success', () => {
    db.setDB([]);
    return request(app)
      .post('/')
      .send({ channelName: 'myFavChannel1' })
      .expect(200)
      .expect('Content-Type', /json/);
  });

  test('no channelName sent', () => {
    db.setDB([]);
    return request(app).post('/').expect(400);
  });
});

describe('[Integration]: Edit a channel', () => {
  test('success', () => {
    db.setDB([]);

    return request(app)
      .post('/')
      .send({ channelName: 'myChannel' })
      .then(res => {
        const editReq = {
          channelNewName: 'NewName123',
          channelUrl: res.body.channelUrl,
          channelPassword: res.body.channelPassword
        };
        return request(app).put('/').send(editReq).expect(200);
      });
  });

  test('wrong auth', () => {
    db.setDB([]);
    return request(app)
      .post('/')
      .send({ channelName: 'myChannel' })
      .then(res => {
        const editReq = {
          channelNewName: 'NewName',
          channelUrl: res.body.channelUrl,
          channelPassword: 'Pass123'
        };
        return request(app).put('/').send(editReq).expect(401);
      });
  });

  test('no channelNewName sent', () => {
    db.setDB([]);
    return request(app).put('/').expect(400);
  });
});
