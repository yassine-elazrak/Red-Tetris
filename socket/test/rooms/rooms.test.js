const authClass = require('../../src/controller/authController')
const roomClass = require('../../src/controller/roomsController');
const RoomModelClass = require('../../src/rooms/rooms')
const UserModelClass = require('../../src/users/users')

let rooms, auth, RoomModel, UserModel;
beforeAll(() => {
    auth = new authClass(global.__io__);
    rooms = new roomClass(global.__io__);
    auth.login(global.__socketServer__)('user', (res, err) => {
        expect(res).toEqual(expect.any(Object))
        expect(err).toBe(null)
        user = res;
    })
})

describe('rooms test', () => {
    RoomModel = new RoomModelClass();
    UserModel = new UserModelClass();
    let roomId, fakeUser

    test('login fake user', async () => {
        try {
            fakeUser = await UserModel.login(
                Math.random().toString(36).substring(2) + Date.now().toString(36),
                'fakeUser'
            )
        } catch (e) {
            expect(e).toMatchObject({
                message: expect.any(String)
            })
        }
    })

    describe('success tests room', () => {

        test('create room', (done) => {
            rooms.createRoom(global.__socketServer__)({
                isPrivate: false,
                roomName: 'room'
            }, (res, err) => {
                expect(res).toMatchObject({
                    id: expect.any(String),
                    name: 'room',
                    admin: user.id,
                    isPrivate: false,
                    status: 'waiting',
                    users: expect.arrayContaining([
                        expect.objectContaining({
                            id: user.id,
                            name: user.name,
                            status: null,
                        })
                    ]),
                    invit: [],
                })
                expect(err).toBe(null)
                // console.log(res)
                roomId = res.id;
                done()
            })

        })

        test('join room', async () => {
            try {

                let res = await RoomModel.joinRoom({
                    roomId,
                    userId: fakeUser.id,
                    userName: fakeUser.name
                })
                // console.log(res)
                expect(res).toBe(null)
            } catch (e) {
                expect(e).toMatchObject({
                    message: expect.any(String)
                })
            }
        })

        test('leave room', (done) => {
            rooms.leaveRoom(global.__socketServer__)(roomId, (res, err) => {
                expect(res).toBe(null)
                expect(err).toBe(null)
                done()
            })
        })

        test('create or join room', (done) => {
            rooms.createOrJoinRoom(global.__socketServer__)({
                roomName: 'room2',
                isPrivate: true,
            }, (res, err) => {
                expect(res).toMatchObject({
                    id: expect.any(String),
                    name: 'room2',
                    admin: user.id,
                    isPrivate: true,
                    status: 'closed',
                    users: expect.arrayContaining([
                        expect.objectContaining({
                            id: user.id,
                            name: user.name,
                            status: null,
                        })
                    ]),
                    invit: [],
                })
                roomId = res.id;
                expect(err).toBe(null)
                done()
            })
        })
        test('change room to public', (done) => {
            rooms.changeRoomToPublic(global.__socketServer__)({ roomId }, (res, err) => {
                expect(res).toMatchObject({
                    id: expect.any(String),
                    name: 'room2',
                    admin: user.id,
                    isPrivate: false,
                    status: 'waiting',
                    users: expect.arrayContaining([
                        expect.objectContaining({
                            id: user.id,
                            name: user.name,
                            status: null,
                        })
                    ]),
                    invit: [],
                })
                expect(err).toBe(null)
                done()
            })
        })

        test('change room status', (done) => {
            rooms.changeStatusRoom(global.__socketServer__)({
                status: 'closed',
                roomId
            }, (res, err) => {
                expect(res).toMatchObject({
                    id: roomId,
                    name: expect.any(String),
                    admin: user.id,
                    isPrivate: false,
                    status: 'closed',
                    users: expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(String),
                            name: expect.any(String),
                            status: null,
                        })
                    ]),
                    invit: [],
                })
                expect(err).toBe(null)
                done()
            })
        })

        test('get current rooms', (done) => {
            rooms.currentRoom(global.__socketServer__)(null, (res, err) => {
                expect(res).toEqual([
                    expect.objectContaining({
                        id: expect.any(String),
                        name: expect.any(String),
                        isPrivate: expect.any(Boolean),
                        status: expect.any(String)
                    }),expect.anything(),
                ])
                expect(err).toBe(null)
                done()
            })
        })

        test('leave room', (done) => {
            rooms.leaveRoom(global.__socketServer__)(roomId, (res, err) => {
                expect(res).toBe(null)
                expect(err).toBe(null)
                done()
            })
        })



    })





    //  fail tests
    describe('fail tests room', () => {
        test('invalid room name', (done) => {
            rooms.createRoom(global.__socketServer__)({
                isPrivate: false,
                roomName: '        '
            }, (res, err) => {
                expect(res).toBe(null)
                expect(err).toMatchObject({
                    message: "Please enter a valid name"
                })
                done()
            })
        })

        test('invalid data type', (done) => {
            rooms.createRoom(global.__socketServer__)({
                isPrivate: 'false',
                roomName: 2223
            }, (res, err) => {
                expect(res).toBe(null)
                expect(err).toMatchObject({
                    message: "Please enter a valid data type"
                })
                done()
            })
        })

        test('invalid data type create or join', (done) => {
            rooms.createOrJoinRoom(global.__socketServer__)({
                isPrivate: 'false',
                roomName: 2223
            }, (res, err) => {
                expect(res).toBe(null)
                expect(err).toMatchObject({
                    message: "Please enter a valid data type"
                })
                done()
            })
        })

        test('long name', (done) => {
            rooms.createRoom(global.__socketServer__)({
                isPrivate: false,
                roomName: "long name long name long name "
            }, (res, err) => {
                expect(res).toBe(null)
                expect(err).toMatchObject({
                    message: "Please enter a valid name"
                })
                done()
            })
        })

        test('leave room not exists', (done) => {
            rooms.leaveRoom(global.__socketServer__)('fack id', (res, err) => {
                expect(res).toBe(null),
                    expect(err).toMatchObject({
                        message: 'Room not found'
                    })
                done()
            })
        })
    })


})

