const authClass = require('../../src/controller/authController')
const roomClass = require('../../src/controller/roomsController');

let rooms, auth, user;
beforeAll((done) => {
    auth = new authClass(global.__io__);
    rooms = new roomClass(global.__io__);
    user = auth.login(global.__socketServer__)('ali', (res, err) => {
        expect(res).toMatchObject({
            id: expect.any(String),
            name: 'ali',
            isJoined: false,
            notif: [],
            room: null,
        })
        expect(err).toBe(null)
    })
})

