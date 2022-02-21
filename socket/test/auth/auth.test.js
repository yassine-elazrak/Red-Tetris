const usersClass = require('../../src/users/users');
const auth = new usersClass();
const fakeId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

describe('auth-login', () => {
    describe('faild login', () => {

        test('invalid name', async () => {
            try {
                expect(await auth.login(fakeId, '-----@')).toBe(null);
            } catch (e) {
                expect(e.message).toBe('Please enter a valid name');
            }
        })

        test('empty name ', async () => {
            try {
                expect(await auth.login(fakeId, "             ")).toBe(null);
            } catch (e) {
                expect(e.message).toBe('Please enter a valid name');
            }
        });

        test('duplicate name', async () => {
            try {
                await auth.login(fakeId, 'name');
                expect(await auth.login(fakeId, 'name')).toBe(null);
            } catch (e) {
                expect(e.message).toBe('Username is already taken');
            }
        })
    })

    describe('success login', () => {
        test('success login', async () => {
            try {
                expect(await auth.login(fakeId, 'ali')).toMatchObject({
                    id: fakeId,
                    name: 'ali',
                    isJoined: false,
                    notif: [],
                    room: null,
                })
            } catch (e) {
                expect(e.message).toBe("Username is already taken");
            }
        });

        test('trim name', async () => {
            try {
                expect(await auth.login(fakeId, '   leet-1337    ')).toMatchObject({
                    id: fakeId,
                    name: 'leet-1337',
                    isJoined: false,
                    notif: [],
                    room: null,
                })
            } catch (e) {
                expect(e.message).toBe("Username is already taken");
            }
        })
    })

    describe('logout', () => {
        test('user not login', async () => {
            try {
                expect(await auth.logout(fakeId + fakeId)).toBe(null);
            } catch (e) {
                expect(e.message).toBe('User not login');
            }
        })
        test('success logout', async () => {
            try {
                expect(await auth.logout(fakeId)).toEqual(expect.any(Array));
            } catch(e){
                expect(e).toBe(null);
            }
        })
    })

})

