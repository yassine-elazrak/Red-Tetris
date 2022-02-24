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
    let roomId, fakeUser, fakeUser2, roomId2;

    test('login fake user', async () => {
        try {
            fakeUser = await UserModel.login(
                Math.random().toString(36).substring(2) + Date.now().toString(36),
                'fakeUser'
            )
            fakeUser2 = await UserModel.login(
                Math.random().toString(36).substr(2) + Date.now().toString(36),
                'fakeUser2'
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

        test('join room fakeUser1', async () => {
            try {

                let res = await RoomModel.joinRoom({
                    roomId,
                    userId: fakeUser.id,
                    userName: fakeUser.name
                })
                // console.log(res)
                expect(res).toMatchObject({
                    id: roomId,
                    users: expect.arrayContaining([
                        expect.objectContaining({
                            id: fakeUser.id,
                            name: fakeUser.name,
                            status: null,
                            scor: 0,
                            rows: 0,
                            map: expect.any(Array),
                            nextTetrominos: expect.any(Array),
                            currentTetromino: expect.any(Object),
                        }), expect.any(Object),
                    ])
                })
            } catch (e) {
                expect(e).toMatchObject({
                    message: expect.any(String)
                })
            }
        })

        test('join room fakeUser2', async () => {
            try {

                let res = await RoomModel.joinRoom({
                    roomId,
                    userId: fakeUser2.id,
                    userName: fakeUser2.name
                })
                // console.log(res)
                expect(res).toMatchObject({
                    id: roomId,
                    users: expect.arrayContaining([
                        expect.objectContaining({
                            id: fakeUser2.id,
                            name: fakeUser2.name,
                            status: null,
                            scor: 0,
                            rows: 0,
                            map: expect.any(Array),
                            nextTetrominos: expect.any(Array),
                            currentTetromino: expect.any(Object),
                        }), expect.any(Object),
                    ])
                })
            } catch (e) {
                expect(e).toMatchObject({
                    message: expect.any(String)
                })
            }
        })

        test('admin leave room', (done) => {
            rooms.leaveRoom(global.__socketServer__)(roomId, (res, err) => {
                expect(res).toBe(null)
                expect(err).toBe(null)
                done()
            })
        })



        test('user leave room', (done) => {
            rooms.leaveRoom({ id: fakeUser2.id })(roomId, (res, err) => {
                expect(res).toBe(null)
                expect(err).toBe(null)
                done()
            })
        })

        test('create or join exist room', (done) => {
            rooms.createOrJoinRoom({ id: fakeUser2.id })({
                roomName: 'room',
                isPrivate: true,
            }, (res, err) => {
                expect(res).toMatchObject({
                    id: roomId,
                    name: 'room',
                    admin: fakeUser.id,
                    status: 'waiting'
                })
                expect(err).toBe(null)
                done()
            })
        })

        test('user leave room', (done) => {
            rooms.leaveRoom({ id: fakeUser2.id })(roomId, (res, err) => {
                expect(res).toBe(null)
                expect(err).toBe(null)
                done()
            })
        })

        test('user join room', (done) => {
            rooms.joinRoom({ id: fakeUser2.id })(roomId, (res, err) => {
                expect(res).toMatchObject({
                    id: roomId,
                    name: 'room',
                    admin: fakeUser.id,
                    status: 'waiting'
                })
                expect(err).toBe(null)
                done()
            })
        })


        test('new admin close room', (done) => {
            rooms.changeStatusRoom({ id: fakeUser.id })({
                status: 'closed',
                roomId
            }, (res, err) => {
                expect(res).toMatchObject({
                    id: roomId,
                    name: expect.any(String),
                    admin: fakeUser.id,
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

        test('create or join new room', (done) => {
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
                roomId2 = res.id;
                expect(err).toBe(null)
                done()
            })
        })
        test('change room to public', (done) => {
            rooms.changeRoomToPublic(global.__socketServer__)({ roomId: roomId2 }, (res, err) => {
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
                roomId: roomId2
            }, (res, err) => {
                expect(res).toMatchObject({
                    id: roomId2,
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
                    }), expect.any(Object),
                ])
                expect(err).toBe(null)
                done()
            })
        })

        test('admin leave room', (done) => {
            rooms.leaveRoom(global.__socketServer__)(roomId2, (res, err) => {
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

