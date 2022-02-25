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

describe('invitation test', () => {
    UserModel = new UserModelClass();
    let room, fakeUser1, fakeUser2;

    /************************* LOGIN FAKE USERS ******************************/
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

    /************************** CREATER ROOM ********************************/
    test('create room1', (done) => {
        Rooms.createRoom(global.__socketServer__)({
            roomName: 'room1',
            isPrivate: false,
        }, (res, err) => {
            expect(res).toEqual(expect.any(Object))
            expect(err).toBeNull()
            room = res;
            done()
        })
    })

    /********************************* SUCCESS TEST *********************************/
    describe('success test invitation', () => {
        test('invit user', (done) => {
            Invite.invitation(global.__socketServer__)({
                userId: fakeUser1.id,
                roomId: room.id
            }, (res, err) => {
                expect(res).toMatchObject({
                    invit: expect.arrayContaining([
                        expect.objectContaining({
                            userId: fakeUser1.id,
                            userName: fakeUser1.name,
                            status: 'waiting'
                        })
                    ])
                })
                expect(err).toBeNull()
                done()
            })
        })
    })


    /*********************************** FAIL TETS ***********************************/


})