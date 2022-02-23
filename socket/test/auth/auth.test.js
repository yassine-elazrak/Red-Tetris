const authClass = require('../../src/controller/authController')


let auth;
beforeAll(() => {
    auth = new authClass(global.__io__)
});

describe('auth tests', () => {

    describe('success login', () => {
        test('login', (done) => {
            auth.login(global.__socketServer__)('ali', (res, err) => {
                expect(res).toMatchObject({
                    id: expect.any(String),
                    name: 'ali',
                    isJoined: false,
                    notif: [],
                    room: null,
                })
                expect(err).toBeNull()
                done();
            })
        })
        test('login trim', (done) => {
            auth.login(global.__socketServer__)(' ali2  ', (res, err) => {
                expect(res).toMatchObject({
                    id: expect.any(String),
                    name: 'ali2',
                    isJoined: false,
                    notif: [],
                    room: null,
                })
                expect(err).toBeNull()
                done();
            })
        })
    });

    describe('fail login', () => {
        test('empty data', (done) => {
            auth.login(global.__socketServer__)('', (res, err) => {
                expect(res).toBeNull()
                expect(err).toMatchObject({
                    message: 'Please enter a valid name',
                })
                done()
            })
        })
        test('invalid data', (done) => {
            auth.login(global.__socketServer__)('----@', (res, err) => {
                expect(res).toBeNull()
                expect(err).toMatchObject({
                    message: 'Please enter a valid name',
                })
                done()
            })
        })
        test('invalid data type', (done) => {
            auth.login(global.__socketServer__)({ name: 'ali' }, (res, err) => {
                expect(res).toBeNull()
                expect(err).toMatchObject({
                    message: 'Please enter a valid name',
                })
                done()
            })
        })
        test('spaces', (done) => {
            auth.login(global.__socketServer__)('          ', (res, err) => {
                expect(res).toBeNull()
                expect(err).toMatchObject({
                    message: 'Please enter a valid name',
                })
                done()
            })
        })
        test('name is already token', (done) => {
            auth.login(global.__socketServer__)('ali', (res, err) => {
                expect(res).toBeNull()
                expect(err).toMatchObject({
                    message: 'Username is already taken',
                })
                done()
            })
        })

        test('short name', (done) => {
            auth.login(global.__socketServer__)('a', (res, err) => {
                expect(res).toBeNull()
                expect(err).toMatchObject({
                    message: 'Please enter a valid name',
                })
                done()
            })
        })

        test('long name', (done) => {
            auth.login(global.__socketServer__)('long name long name long long long', (res, err) => {
                expect(res).toBeNull()
                expect(err).toMatchObject({
                    message: 'Please enter a valid name',
                })
                done()
            })
        })
    })
})
