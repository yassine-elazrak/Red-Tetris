const authClass = require('../../src/controller/authController')
const roomClass = require('../../src/controller/roomsController');
const UserModelClass = require('../../src/users/users')
const InviteClass = require('../../src/controller/inviteController')

let user, Rooms, Auth, UserModel, Invite;
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
    let room, fakeUser1, fakeUser2, invit1, invit2;

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
    describe('success tests invitation', () => {
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

        test('invit user2', (done) => {
            Invite.invitation(global.__socketServer__)({
                userId: fakeUser2.id,
                roomId: room.id
            }, (res, err) => {
                expect(res).toMatchObject({
                    invit: expect.arrayContaining([
                        expect.objectContaining({
                            userId: fakeUser2.id,
                            userName: fakeUser2.name,
                            status: 'waiting'
                        })
                    ])
                })
                expect(err).toBeNull()
                done()
            })
        })

        test('update fakeUser1', async () => {
            try {
                fakeUser1 = await UserModel.getUser(fakeUser1.id)
                invit1 = fakeUser1.notif.find(n => n.type === 'invitation')
            } catch (e) {
                expect(e).toMatchObject({
                    message: expect.any(String)
                })
            }
        })

        test('update fakeUser2', async () => {
            try {
                fakeUser2 = await UserModel.getUser(fakeUser2.id)
                invit2 = fakeUser2.notif.find(n => n.type === 'invitation')
            } catch (e) {
                expect(e).toMatchObject({
                    message: expect.any(String)
                })
            }
        })

        test('accept invitations', (done) => {
            Invite.changeStatusInvitation({ id: fakeUser1.id }, 'accepted')({
                notifId: invit1.id
            }, (res, err) => {
                expect(res).toMatchObject({
                    profile: expect.objectContaining({
                        room: room.id,
                        isJoined: true
                    }),
                    room: expect.objectContaining({
                        id: room.id,
                        admin: user.id,
                        name: room.name
                    })
                })
                expect(err).toBeNull()
                done()
            })
        })

        test('decline invitations', (done) => {
            Invite.changeStatusInvitation({ id: fakeUser2.id }, 'decline')({
                notifId: invit2.id
            }, (res, err) => {
                expect(res).toMatchObject({
                    profile: expect.objectContaining({
                        room: null,
                        isJoined: false
                    }),
                    room: null,
                })
                expect(err).toBeNull()
                done()
            })
        })

    })


    /*********************************** FAIL TETS ***********************************/
    describe('fail tests invitation', () => {
        describe('invitation', () => {
            test('user already invited', (done) => {
                Invite.invitation(global.__socketServer__)({
                    userId: fakeUser2.id,
                    roomId: room.id
                }, (res, err) => {
                    expect(res).toBeNull()
                    expect(err).toMatchObject({
                        message: expect.any(String)
                    })
                    done()
                })
            })
            test('user already joined in a room', done => {
                Invite.invitation(global.__socketServer__)({
                    userId: user.id,
                    roomId: room.id
                }, (res, err) => {
                    expect(res).toBeNull()
                    expect(err).toMatchObject({
                        message: expect.any(String)
                    })
                    done()
                })
            })

            test('user not admin invitation', done => {
                Invite.invitation({ id: fakeUser1.id })({
                    userId: fakeUser2.id,
                    roomId: room.id,
                }, (res, err) => {
                    expect(res).toBeNull()
                    expect(err).toMatchObject({
                        message: "you are not admin of this room"
                    })
                    done()
                })
            })

            test('invalid data', done => {
                Invite.invitation(global.__socketServer__)(null, (res, err) => {
                    expect(res).toBeNull()
                    expect(err).toMatchObject({
                        message: expect.any(String)
                    })
                    done()
                })
            })
        })

        describe('invitation status', () => {
            test('invalid dat', done => {
                Invite.changeStatusInvitation(global.__socketServer__)(null, (res, err) => {
                    expect(res).toBeNull()
                    expect(err).toMatchObject({
                        message: expect.any(String)
                    })
                    done()
                })
            })

            test('accept invitations', (done) => {
                Invite.changeStatusInvitation({ id: fakeUser1.id }, 'accepted')({
                    notifId: invit1.id
                }, (res, err) => {
                    expect(res).toBeNull()
                    expect(err).toMatchObject({
                        message: expect.any(String)
                    })
                    done()
                })
            })

            test('invitation not exists', done => {
                Invite.changeStatusInvitation({id: fakeUser2.id}, 'accepted')({
                    notifId: 'invalid id'
                }, (res, err) => {
                    expect(res).toBeNull()
                    expect(err).toMatchObject({
                        message: expect.any(String)
                    })
                    done()
                })
            })

            test('invitations already read', done => {
                Invite.changeStatusInvitation({ id: fakeUser2.id }, 'decline')({
                    notifId: invit2.id
                }, (res, err) => {
                    expect(res).toBeNull()
                    expect(err).toMatchObject({
                        message: expect.any(String)
                    })
                    done()
                })
            })

        })

    })

})
