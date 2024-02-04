import * as appHandler from '@/app/api/auth/register/route';
import { testApiHandler } from 'next-test-api-route-handler';

describe('/api/auth/register', () => {
  it('ユーザー登録されるか', async () => {
    await testApiHandler({
      appHandler,
      async test({ fetch }) {
        const userData = {
          userName: 'John Doe',
          displayName: '名無しの権兵衛',
          password: 'password',
          email: 'john-doe@email.com',
        };
        const response = await fetch({
          method: 'POST',
          body: JSON.stringify(userData),
        });
        const json = await response.json();
        expect(response.status).toStrictEqual(201);
        expect(json.userName).toStrictEqual(userData.userName);
        expect(Object.keys(json).includes('userId')).toStrictEqual(true);
        expect(Object.keys(json).includes('token')).toStrictEqual(true);
      },
    });
  });
  it('同じユーザー名とメールアドレスのユーザーは登録されないか', async () => {
    await testApiHandler({
      appHandler,
      async test({ fetch }) {
        const userData = {
          userName: 'John Doe',
          displayName: '名無しの権兵衛',
          password: 'password',
          email: 'john-doe@email.com',
        };
        const response = await fetch({
          method: 'POST',
          body: JSON.stringify(userData),
        });
        expect(response.status).toStrictEqual(500);
      },
    });
  });
  it('ユーザー名が空の時、エラーになるか', async () => {
    await testApiHandler({
      appHandler,
      async test({ fetch }) {
        const userData = {
          userName: '',
          displayName: '名無しの権兵衛',
          password: 'password',
          email: 'john-doe@email.com',
        };
        const response = await fetch({
          method: 'POST',
          body: JSON.stringify(userData),
        });
        const json = await response.json();
        expect(response.status).toStrictEqual(400);
        expect(json.message).toStrictEqual('必要な情報が不足しています。');
      },
    });
  });
  it('表示名が空の時、エラーになるか', async () => {
    await testApiHandler({
      appHandler,
      async test({ fetch }) {
        const userData = {
          userName: 'John Doe',
          displayName: '',
          password: 'password',
          email: 'john-doe@email.com',
        };
        const response = await fetch({
          method: 'POST',
          body: JSON.stringify(userData),
        });
        const json = await response.json();
        expect(response.status).toStrictEqual(400);
        expect(json.message).toStrictEqual('必要な情報が不足しています。');
      },
    });
  });
  it('パスワードが空の時、エラーになるか', async () => {
    await testApiHandler({
      appHandler,
      async test({ fetch }) {
        const userData = {
          userName: 'John Doe',
          displayName: '名無しの権兵衛',
          password: '',
          email: 'john-doe@email.com',
        };
        const response = await fetch({
          method: 'POST',
          body: JSON.stringify(userData),
        });
        const json = await response.json();
        expect(response.status).toStrictEqual(400);
        expect(json.message).toStrictEqual('必要な情報が不足しています。');
      },
    });
  });
  it('メールアドレスが空の時、エラーになるか', async () => {
    await testApiHandler({
      appHandler,
      async test({ fetch }) {
        const userData = {
          userName: 'John Doe',
          displayName: '名無しの権兵衛',
          password: 'password',
          email: '',
        };
        const response = await fetch({
          method: 'POST',
          body: JSON.stringify(userData),
        });
        const json = await response.json();
        expect(response.status).toStrictEqual(400);
        expect(json.message).toStrictEqual('必要な情報が不足しています。');
      },
    });
  });
});
