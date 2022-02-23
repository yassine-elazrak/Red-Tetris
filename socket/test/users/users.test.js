const usersClass = require('../../src/controller/usersController');
const authClass = require('../../src/controller/authController')
let users, auth;
beforeAll((done) => {
    users = new usersClass(global.__io__);
    auth = new authClass(global.__io__);
    auth.login(global.__socketServer__)('ali', (res, err) => {
        expect(res).toEqual(expect.any(Object))
        expect(err).toBe(null)
        done();
    })
})

test('get online users', (done) => {
    users.onlineUsers()(null, (res, err) => {
        expect(res).toEqual([
            expect.objectContaining({
                id: expect.any(String),
                name: expect.any(String),
                isJoined: expect.any(Boolean)
            })
        ])
        expect(err).toBe(null)
        done();
    })
})

