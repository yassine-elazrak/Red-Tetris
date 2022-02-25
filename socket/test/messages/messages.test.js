const usersClass = require('../../src/controller/usersController')
const roomsClass = require('../../src/controller/roomsController')
const messagesClass = require('../../src/controller/messagesController')
const authClass = require('../../src/controller/authController')
const UsersModel = require('../../src/users/users')
const RoomsModel = require('../../src/rooms/rooms')

let user, Auth, Rooms, Users, Messages, RoomModel, UserModel;

beforeAll((done) => {
    Rooms = new roomsClass(global.__io__);
    Users = new usersClass(global.__io__);
    Auth = new authClass(global.__io__)
    Messages = new messagesClass(global.__io__)
    Auth.login(global.__socketServer__)('admin', (res, err) => {
        expect(res).toEqual(expect.any(Object))
        expect(err).toBe(null)
        user = res
        done()
    })
})

describe('messages tests', () => {
    RoomModel = new RoomsModel()
    UserModel = new UsersModel()
    let room, fakeUser

    describe('init user and room', () => {
        /********************** CONNECT FAKE USER ******************/
        test('login fake user', async () => {
            try {
                fakeUser = await UserModel.login(
                    Math.random().toString(36).substring(2) + Date.now().toString(36),
                    'fakeUser'
                )
                expect()
            } catch (e) {
                expect(e).toMatchObject({
                    message: expect.any(String)
                })
            }
        })

        /*********************** CREATE ROOM ************************/
        test('create room', (done) => {
            Rooms.createRoom(global.__socketServer__)({
                isPrivate: false,
                roomName: 'room'
            }, (res, err) => {
                expect(res).toEqual(expect.any(Object))
                expect(err).toBe(null)
                room = res
                done()
            })
        })

        /********************** USER JOIN ROOM **********************/
        test('join to room', async () => {
            try {
                let res = await RoomModel.joinRoom({
                    roomId: room.id,
                    userId: fakeUser.id,
                    userName: fakeUser.name
                })
                expect(res).toEqual(expect.any(Object))
                // console.log(res)
            } catch (e) {
                expect(e).toBe(null)
            }
        })

    })
    /*********************** SUCCESS TESTS **********************/
    describe('success tests', () => {
        test('send message', (done) => {
            Messages.sentMessage(global.__socketServer__)({
                roomId: room.id,
                message: 'test message'
            }, (res, err) => {
                // console.log(res)
                expect(res).toMatchObject({
                    userId: user.id,
                    userName: user.name,
                    message: 'test message',
                    createdAt: expect.any(Date)
                })
                expect(err).toBe(null)
                done()
            })
        })
    })

    test('leave room', (done) => {
        Rooms.leaveRoom({id: fakeUser.id})(room.id, (res, err) => {
            expect(res).toBe(null)
            expect(err).toBe(null)
            done()
        })
    })





    /************************* FAIL TESTS ************************/
    describe('fail tests', () => {
        test('user no joined sent message', (done) => {
            Messages.sentMessage({id: fakeUser.id})({
                roomId: room.id,
                message: 'fail message'
            }, (res, err) => {
                expect(res).toBe(null)
                expect(err).toMatchObject({
                    message: expect.any(String)
                })
                done()
            })
        })

        test('user not found', (done) => {
            Messages.sentMessage({id: 'invalid id'})({
                roomId: room.id,
                message: 'fail message'
            }, (res, err) => {
                expect(res).toBe(null)
                expect(err).toMatchObject({
                    message: 'User not found'
                })
                done()
            })
        })

    })

})