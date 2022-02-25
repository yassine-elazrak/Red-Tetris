const authClass = require('../../src/controller/authController')
const roomClass = require('../../src/controller/roomsController');
const UserModelClass = require('../../src/users/users')

let user, Rooms, Auth, UserModel;
beforeAll((done) => {
    Auth = new authClass(global.__io__);
    Rooms = new roomClass(global.__io__);
    Auth.login(global.__socketServer__)('user', (res, err) => {
        expect(res).toEqual(expect.any(Object))
        expect(err).toBe(null)
        user = res;
        done()
    })
})

describe('rooms tests', () => {
    UserModel = new UserModelClass();
    let roomId1, roomId2, fakeUser1, fakeUser2;

    /************************* logi fake users ******************************/
    test('login fake users', async () => {
        try {
            fakeUser1 = await UserModel.login(
                Math.random().toString(36).substr(2) + Date.now().toString(36),
                'fakeUser1'
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

    /************************ SUCCESS TEST *******************************/
    describe('success test', () => {
        test('create room1', (done) => {
            Rooms.createRoom(global.__socketServer__)({
                roomName: 'room1',
                isPrivate: true,
            }, (res, err) => {
                expect(res).toMatchObject({
                    id: expect.any(String),
                    name: 'room1',
                    admin: user.id,
                    isPrivate: true,
                    status: 'closed'
                })
                expect(err).toBeNull()
                roomId1 = res.id;
                done()
            })
        })

        test('change room to Public', (done) => {
            Rooms.changeRoomToPublic(global.__socketServer__)({ roomId: roomId1 }, (res, err) => {
                expect(res).toMatchObject({
                    id: roomId1,
                    name: 'room1',
                    isPrivate: false,
                    status: 'waiting'
                })
                expect(err).toBeNull()
                done()
            })
        })

        test('create or join new room', (done) => {
            Rooms.createOrJoinRoom({ id: fakeUser1.id })({
                roomName: 'room2',
                isPrivate: false,
            }, (res, err) => {
                expect(res).toMatchObject({
                    id: expect.any(String),
                    name: 'room2',
                    isPrivate: false,
                    admin: fakeUser1.id,
                    status: 'waiting'
                })
                expect(err).toBeNull()
                roomId2 = res.id;
                done()
            })
        })

        test('create or join exists room', (done) => {
            Rooms.createOrJoinRoom({ id: fakeUser2.id })({
                roomName: 'room2',
                isPrivate: false,
            }, (res, err) => {
                expect(res).toMatchObject({
                    id: roomId2,
                    name: 'room2',
                    isPrivate: false,
                    admin: fakeUser1.id,
                    status: 'waiting'
                })
                expect(err).toBeNull()
                done()
            })
        })



        test('admin leave room', (done) => {
            Rooms.leaveRoom({ id: fakeUser1.id })(roomId2, (res, err) => {
                expect(res).toBeNull()
                expect(err).toBeNull()
                done()
            })
        })

        test('join room', (done) => {
            Rooms.joinRoom({ id: fakeUser1.id })(roomId2, (res, err) => {
                expect(res).toMatchObject({
                    id: roomId2,
                    name: 'room2',
                    isPrivate: false,
                    admin: fakeUser2.id,
                    status: 'waiting'
                })
                expect(err).toBeNull()
                done()
            })
        })

        test('change room status (closed)', (done) => {
            Rooms.changeStatusRoom({ id: fakeUser2.id })({
                roomId: roomId2,
                status: 'closed'
            }, (res, err) => {
                expect(res).toMatchObject({
                    id: roomId2,
                    status: 'closed'
                })
                expect(err).toBeNull()
                done()
            })
        })

        test('admin logout', (done) => {
            Auth.logout({ id: fakeUser2.id })()
            done()
        })

        test('admin leave room and delet room', (done) => {
            Rooms.leaveRoom({ id: fakeUser1.id })(roomId2, (res, err) => {
                expect(res).toBeNull()
                expect(err).toBeNull()
                done()
            })
        })
        test('get current rooms', (done) => {
            Rooms.currentRoom()(null, (res, err) => {
                expect(res).toEqual(expect.any(Array))
                expect(err).toBeNull()
                done()
            })
        })
    })



    /********************** FAIL TESTS ***********************************/
    describe("fail test", () => {
        /********************** FAIL USER NOT LOGIN  ***********************/
        describe('user not login', () => {
            test('user not login create room', (done) => {
                Rooms.createRoom({ id: 'invalid id' })({
                    roomName: 'room',
                    isPrivate: false
                }, (res, err) => {
                    expect(res).toBeNull()
                    expect(err).toMatchObject({
                        message: 'User not found'
                    })
                    done()
                })
            })

            test('user not login join or create', (done) => {
                Rooms.createOrJoinRoom({ id: 'invalid id' })({
                    roomName: 'room',
                    isPrivate: false,
                }, (res, err) => {
                    expect(res).toBeNull()
                    expect(err).toMatchObject({
                        message: 'User not found'
                    })
                    done()
                })
            })

            test('user not login join room', (done) => {
                Rooms.joinRoom({ id: 'invalid id' })(roomId1, (res, err) => {
                    expect(res).toBeNull()
                    expect(err).toMatchObject({
                        message: "User not found"
                    })
                    done()
                })
            })

            test('user not login change room status', (done) => {
                Rooms.changeStatusRoom({id: 'invalid id'})({
                    roomId: roomId1,
                    status: 'closed'
                }, (res, err) => {
                    expect(res).toBeNull()
                    expect(err).toMatchObject({
                        message: "You are not admin"
                    })
                    done()
                })
            })

            test('user not login change room to public', (done) => {
                Rooms.changeRoomToPublic({id: 'invalid id'})({roomId: roomId1}, (res, err) => {
                    expect(res).toBeNull()
                    expect(err).toMatchObject({
                        message: "You are not admin"
                    })
                    done()
                })
            })

            test('user not login leave room', (done) => {
                Rooms.leaveRoom({id: 'invalid id'})(roomId1, (res, err) => {
                    expect(res).toBeNull()
                    expect(err).toMatchObject({
                        message: "User is not joined"
                    })
                    done()
                })
            })
            
        })
        /************************ FAIL INVALID DATA TYPE *********************/
        describe('fail invalid data type', () => {
            test('login invalid data type', (done) =>{
                Rooms.createRoom(global.__socketServer__)('invalid data', (res, err) => {
                    expect(res).toBeNull()
                    expect(err).toMatchObject({
                        message: "Please enter a valid data type"
                    })
                    done()
                })
            })
            test('create or join invalid data type', (done) => {
                Rooms.createOrJoinRoom(global.__socketServer__)('invalid data', (res, err) => {
                    expect(res).toBeNull()
                    expect(err).toMatchObject({
                        message: "Please enter a valid data type"
                    })
                    done()
                })
            })

            test('join invalid data type', (done) => {
                Rooms.joinRoom(global.__socketServer__)(null, (res, err) => {
                    expect(res).toBeNull()
                    expect(err).toMatchObject({
                        message: "Please enter a valid data type"
                    })
                    done()
                })
            })

            test('change status invalid data type', (done) => {
                Rooms.changeStatusRoom(global.__socketServer__)(null, (res, err) => {
                    expect(res).toBeNull()
                    expect(err).toMatchObject({
                        message: "Please enter a valid data type"
                    })
                    done()
                })
            })
            test('change room to public invalid data type', (done) => {
                Rooms.changeRoomToPublic(global.__socketServer__)(null, (res, err) => {
                    expect(res).toBeNull()
                    expect(err).toMatchObject({
                        message: "Please enter a valid data type"
                    })
                    done()
                })
            })

            test('leave room invalid data type', (done) => {
                Rooms.leaveRoom(global.__socketServer__)(null, (res, err) => {
                    expect(res).toBeNull()
                    expect(err).toMatchObject({
                        message: "Please enter a valid data type"
                    })
                    done()
                })
            })

            /********************* FAIL USER ALREADY IN A ROOM **********************/
            describe('fail user already in a room', () => {
                test('creater room ', (done) => {
                    Rooms.createRoom(global.__socketServer__)({
                        roomName: 'test',
                        isPrivate: false
                    }, (res, err) => {
                        expect(res).toBeNull()
                        expect(err).toMatchObject({
                            message: "You are already in a room"
                        })
                        done()
                    })
                })
                test('create or join room', (done) => {
                    Rooms.createOrJoinRoom(global.__socketServer__)({
                        roomName: 'test',
                        isPrivate: false,
                    }, (res, err) => {
                        expect(res).toBeNull()
                        expect(err).toMatchObject({
                            message: "You are already in a room"
                        })
                        done()
                    })
                })
                test('join room', (done) =>{
                    Rooms.joinRoom(global.__socketServer__)(roomId1, (res, err) => {
                        expect(res).toBeNull()
                        expect(err).toMatchObject({
                            message: "You are already in a room"
                        })
                        done()
                    })
                })
            })
        })



    })




})

