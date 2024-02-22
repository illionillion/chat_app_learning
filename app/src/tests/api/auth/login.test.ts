import { testApiHandler } from 'next-test-api-route-handler';
import * as appHandlerLogin from '@/app/api/auth/login/route';

describe('/api/auth/login', () => {
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
      },
    });
  });
});
