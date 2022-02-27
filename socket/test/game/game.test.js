const authClass = require('../../src/controller/authController')
const roomClass = require('../../src/controller/roomsController');
const UserModelClass = require('../../src/users/users')
const InviteClass = require('../../src/controller/inviteController')
const GameClass = require('../../src/rooms/game')

let user, Rooms, Auth, Game, UserModel, Invite, player;
beforeAll((done) => {
    Auth = new authClass(global.__io__);
    Rooms = new roomClass(global.__io__);
    Invite = new InviteClass(global.__socketServer__)
    Game = new GameClass()
    UserModel =new UserModelClass()
    Auth.login(global.__socketServer__)('user', (res, err) => {
        expect(res).toEqual(expect.any(Object))
        expect(err).toBe(null)
        user = res;
        done()
    })
})

describe('game tests', () => {
    let room, fakeUser;

    test('login fake users', async () => {
        try {
            fakeUser = await UserModel.login(
                Math.random().toString(36).substr(2) + Date.now().toString(36),
                'fakeUser'
            )
        } catch (e) {
            expect(e).toMatchObject({
                message: expect.any(String)
            })
        }
    })

    test('create room', (done) => {
        Rooms.createRoom(global.__socketServer__)({
            roomName: 'room',
            isPrivate: false,
        }, (res, err) => {
            expect(res).toEqual(expect.any(Object))
            expect(err).toBeNull()
            room = res;
            done()
        })
    })

    test('fake user join room', done => {
        Rooms.joinRoom({id: fakeUser.id})(room.id, (res, err) => {
            expect(res).toEqual(expect.any(Object))
            expect(err).toBeNull()
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
    let fakeStage = Array.from(Array(20), () => new Array(10).fill(['W', 'wall']))
   
    test('move right', (done) => {
        Rooms.gameAction(global.__socketServer__)({
            roomId: room.id,
            action: 'right'
        }, (res, err) => {
            expect(res).toEqual(expect.any(Object))
            expect(err).toBeNull()
            done()
        })
    })

    test('move left', (done) => {
        Rooms.gameAction(global.__socketServer__)({
            roomId: room.id,
            action: 'left'
        }, (res, err) => {
            expect(res).toEqual(expect.any(Object))
            expect(err).toBeNull()
            done()
        })
    })

    test('rotate', (done) => {
        Rooms.gameAction(global.__socketServer__)({
            roomId: room.id,
            action: 'rotate'
        }, (res, err) => {
            expect(res).toEqual(expect.any(Object))
            expect(err).toBeNull()
            player = res;
            done()
        })
    })

    test('dropDown', (done) => {
        Rooms.gameAction(global.__socketServer__)({
            roomId: room.id,
            action: 'dropDown'
        }, (res, err) => {
            expect(res).toEqual(expect.any(Object))
            expect(err).toBeNull()
            done()
        })
    })

    test('game test', async () => {
        try {
            player.map = fakeStage;
            player = await Game.action('down', player, room)
            expect(player).toEqual(expect.any(Object))
        } catch (e) {
            expect(e).toBeNull()
        }
    })

    test('move down game over', (done) => {
        Rooms.gameAction(global.__socketServer__)({
            roomId: room.id,
            action: 'down'
        }, (res, err) => {
            expect(res).toEqual(expect.any(Object))
            expect(err).toBeNull()
            done()
        })
    })

    test('continue', (done) => {
        Rooms.gameContinue(global.__socketServer__)({
            roomId: room.id,
        }, (res, err) => {
            expect(res).toEqual(expect.any(Object))
            expect(err).toBeNull()
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

    describe('fail game tests', () => {
        test('invalid data type', done => {
            Rooms.gameAction(global.__socketServer__)(null, (res, err) => {
                expect(res).toBeNull()
                expect(err).toMatchObject({
                    message: 'Please enter a valid data'
                })
                done()
            })
        })

        test('room not exists', done => {
            Rooms.gameAction(global.__socketServer__)({
                roomId: 'invalid id',
                action: 'down'
            }, (res, err) => {
                expect(res).toBeNull()
                expect(err).toMatchObject({
                    message: 'Room not found'
                })
                done()
            })
        })

        test('user not joined', done => {
            Rooms.gameAction({id: 'invalid user id'})({
                roomId: room.id,
                action: 'down'
            }, (res, err) => {
                expect(res).toBeNull()
                expect(err).toMatchObject({
                    message: 'You are not joined in this room'
                })
                done()
            })
        })

        test('user not joined continue game', done => {
            Rooms.gameContinue({id: 'invlaid user id'})({
                roomId: room.id,
                action: 'down'
            }, (res, err) => {
                expect(res).toBeNull()
                expect(err).toMatchObject({
                    message: 'You are not joined in this room'
                })
                done()
            })
        })
    })

})