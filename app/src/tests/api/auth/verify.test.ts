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
        expect(
          response.headers.get('Authorization')?.includes('Bearer '),
        ).toStrictEqual(true);

        userId = json.userId;
        token = response.headers
          .get('Authorization')!
          .replace('Bearer ', '')
          .trim();
      },
    });
  });
  it('ユーザーが正しく認証されるか', async () => {
    await testApiHandler({
      appHandler: appHandlerVerify,
      async test({ fetch }) {
        const userData = {
          userId: userId,
        };
        const response = await fetch({
          method: 'POST',
          body: JSON.stringify(userData),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
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
        };
        const response = await fetch({
          method: 'POST',
          body: JSON.stringify(userData),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
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
        };
        const response = await fetch({
          method: 'POST',
          body: JSON.stringify(userData),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.split('').reverse().join('')}`,
          },
        });
        const json = await response.json();
        expect(response.status).toStrictEqual(401);
        expect(json.authenticated).toStrictEqual(false);
      },
    });
  });
});
