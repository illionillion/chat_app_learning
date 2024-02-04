import { testApiHandler } from 'next-test-api-route-handler';
import * as appHandlerVerify from '@/app/api/auth/verify/route';
import * as appHandlerLogin from '@/app/api/auth/login/route';

describe('/api/auth/verify', () => {
  let userId = 0;
  let token = '';

  it('ログインできるか', async () => {
    await testApiHandler({
      appHandler: appHandlerLogin,
      async test({ fetch }) {
        const userData = {
          userName: 'Yusuke',
          password: 'password',
        };
        const response = await fetch({
          method: 'POST',
          body: JSON.stringify(userData),
        });
        const json = await response.json();
        expect(response.status).toStrictEqual(200);
        expect(json.userName).toStrictEqual(userData.userName);
        expect(Object.keys(json).includes('userId')).toStrictEqual(true);
        expect(Object.keys(json).includes('token')).toStrictEqual(true);

        userId = json.userId;
        token = json.token;
      },
    });
  });
  it('ユーザーが正しく認証されるか', async () => {
    await testApiHandler({
      appHandler: appHandlerVerify,
      async test({ fetch }) {
        const userData = {
          userId: userId,
          token: token,
        };
        const response = await fetch({
          method: 'POST',
          body: JSON.stringify(userData),
        });
        const json = await response.json();
        expect(response.status).toStrictEqual(200);
        expect(json.authenticated).toStrictEqual(true);
      },
    });
  });
  it('userIdが一致しない場合エラーが返るか', async () => {
    await testApiHandler({
      appHandler: appHandlerVerify,
      async test({ fetch }) {
        const userData = {
          userId: userId * Math.floor(Math.random() * (100 + 1 - 2)) + 2,
          token: token,
        };
        const response = await fetch({
          method: 'POST',
          body: JSON.stringify(userData),
        });
        const json = await response.json();
        expect(response.status).toStrictEqual(401);
        expect(json.authenticated).toStrictEqual(false);
      },
    });
  });
  it('tokenが一致しない場合エラーが返るか', async () => {
    await testApiHandler({
      appHandler: appHandlerVerify,
      async test({ fetch }) {
        const userData = {
          userId: userId,
          token: token.split('').reverse().join(''),
        };
        const response = await fetch({
          method: 'POST',
          body: JSON.stringify(userData),
        });
        const json = await response.json();
        expect(response.status).toStrictEqual(401);
        expect(json.authenticated).toStrictEqual(false);
      },
    });
  });
});
