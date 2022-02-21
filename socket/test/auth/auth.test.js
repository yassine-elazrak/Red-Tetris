const fakeClient = require('../clientSocket');


describe('auth-login', () => {
    describe('faild login', () => {
        test('empty data', async () => {
            try {
                expect(await fakeClient('login', null)).toBe(null);
            } catch (e) {
                expect(e).toBe('Please enter a valid name');
            }
        });
        test('invalid type data', async () => {
            try {
                expect(await fakeClient('login', { name: '----@' })).toBe(null);
            } catch (e) {
                expect(e).toBe('Please enter a valid name');
            }
        })
        test('invalid name', async () => {
            try{
                expect(await fakeClient('login', '----@')).toBe(null);
            }catch(e){
                expect(e).toBe('Please enter a valid name');
            }
        })
        test('duplicate name', async () => {
            try{
                await fakeClient('login', 'name');
                expect(await fakeClient('login', 'name')).toBe(null);
            }catch(e){
                expect(e).toBe('Username is already taken');
            }
        })
    })

    describe('success login', () => {
        test('success login', async () => {
            try {
                expect(await fakeClient('login', 'ali')).toMatchObject({
                    id: expect.any(String),
                    name: 'ali',
                    isJoined: false,
                    notif: [],
                    room: null,
                })
            } catch (e) {
                expect(e).toBe("Username is already taken");
            }
        });
        test('trim name', async () => {
            try {
                expect(await fakeClient('login', '   leet-1337    ')).toMatchObject({
                    id: expect.any(String),
                    name: 'leet-1337',
                    isJoined: false,
                    notif: [],
                    room: null,
                })
            }catch(e){
                expect(e).toBe("Username is already taken");
            }
        })
    })
})