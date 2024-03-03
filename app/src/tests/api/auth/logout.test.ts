import { testApiHandler } from 'next-test-api-route-handler';
import * as appHandlerLogout from '@/app/api/auth/logout/route';
import * as appHandlerLogin from '@/app/api/auth/login/route';

describe('/api/auth/logout', () => {
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
  it('ログアウトできるか', async () => {
    await testApiHandler({
      appHandler: appHandlerLogout,
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
        expect(response.status).toStrictEqual(200);
      },
    });
  });
});
