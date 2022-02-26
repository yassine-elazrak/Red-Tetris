const authClass = require('../../src/controller/authController')
const roomClass = require('../../src/controller/roomsController');
const RoomModelClass = require('../../src/rooms/rooms')
const UserModelClass = require('../../src/users/users')
const InviteClass = require('../../src/controller/inviteController')

let user, Rooms, Auth, RoomModel, UserModel, Invite;
beforeAll((done) => {
    Auth = new authClass(global.__io__);
    Rooms = new roomClass(global.__io__);
    Invite = new InviteClass(global.__socketServer__)
    Auth.login(global.__socketServer__)('user', (res, err) => {
        expect(res).toEqual(expect.any(Object))
        expect(err).toBe(null)
        user = res;
        done()
    })
})

describe('game tests', () => {
    let room;
    test('create room', (done) => {
        Rooms.createRoom(global.__socketServer__)({
            roomName: 'room',
            isPrivate: true,
        }, (res, err) => {
            expect(res).toEqual(expect.any(Object))
            expect(err).toBeNull()
            room = res;
            done()
        })
    })

    test('start game', done => {
        Rooms.changeStatusRoom(global.__socketServer__)({
            roomId: room.id,
            status: 'started'
        }, (res, err) => {
            expect(res).toMatchObject({
                status: 'started'
            })
            expect(err).toBeNull()
            done()
        })
    })

    /************** PLAY GAME ********************/
    // test('loop', done => {
    let status = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    // while (loop < 1) {
    // console.log(loop)
    test.each(status)('Playe Game', (_, done) => {
        // test('loop', done => {
        Rooms.gameAction(global.__socketServer__)({
            roomId: room.id,
            action: 'down'
        }, (res, err) => {
            expect(res).toEqual(expect.any(Object))
            expect(err).toBeNull()
            console.log(res.currentTetromino)
            status.push(res.status)
            done()
            // loop++;
        })
        // })
    })
    // console.log('t')
    // }
    // done()
    // })



})