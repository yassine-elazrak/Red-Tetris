const { kebabCase } = require('lodash');
const authClass = require('../../src/controller/authController')
const roomClass = require('../../src/controller/roomsController');
const RoomModelClass = require('../../src/rooms/rooms')
const UserModelClass = require('../../src/users/users')

let user, Rooms, Auth, RoomModel, UserModel;
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
    RoomModel = new RoomModelClass();
    UserModel = new UserModelClass();
    let roomId1, fakeUser1, fakeUser2, roomId2, fakeUser3;

    /************************* logi fake users ******************************/
    test('login fake users', async () => {
        try {
            fakeUser1 = await UserModel.login(
                Math.random().toString(36).substring(2) + Date.now().toString(36),
                'fakeUser'
            )
            fakeUser2 = await UserModel.login(
                Math.random().toString(36).substr(2) + Date.now().toString(36),
                'fakeUser2'
            )
            fakeUser3 = await UserModel.login(
                Math.random().toString(36).substr(2) + Date.now().toString(36),
                'fakeUser3'
            )
            // console.log(fakeUser1, fakeUser2, fakeUser3)
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
            Rooms.createOrJoinRoom({ id: fakeUser2.id })({
                roomName: 'room2',
                isPrivate: false,
            }, (res, err) => {
                expect(res).toMatchObject({
                    id: expect.any(String),
                    name: 'room2',
                    isPrivate: false,
                    admin: fakeUser2.id,
                    status: 'waiting'
                })
                expect(err).toBeNull()
                roomId2 = res.id;
                done()
            })
        })

        test('create or join exists room', (done) => {
            Rooms.createOrJoinRoom({ id: fakeUser3.id })({
                roomName: 'room2',
                isPrivate: false,
            }, (res, err) => {
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



        test('admin leave room', (done) => {
            Rooms.leaveRoom({ id: fakeUser2.id })(roomId2, (res, err) => {
                expect(res).toBeNull()
                expect(err).toBeNull()
                done()
            })
        })

        test('join room', (done) => {
            Rooms.joinRoom({ id: fakeUser2.id })(roomId2, (res, err) => {
                expect(res).toMatchObject({
                    id: roomId2,
                    name: 'room2',
                    isPrivate: false,
                    admin: fakeUser3.id,
                    status: 'waiting'
                })
                expect(err).toBeNull()
                done()
            })
        })

        test('change room status (closed)', (done) => {
            Rooms.changeStatusRoom({ id: fakeUser3.id })({
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
            Auth.logout({ id: fakeUser3.id })()
            done()
        })

        test('admin leave room and delet room', (done) => {
            Rooms.leaveRoom({ id: fakeUser2.id })(roomId2, (res, err) => {
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
    // describe("fail test", () => {

    // })




})

