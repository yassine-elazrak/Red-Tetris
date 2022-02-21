const usersClass = require('../../src/users/users');
const users = new usersClass();
const fakeId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

test('create new class', () => {
    expect(new usersClass()).toBe(users)
})

describe('get users', () => {
    test('get all users', () => {
        expect(users.getUsers()).toEqual(expect.any(Array));
    })
})

describe('get user', () => {
    test('fail get user', async () => {
        try {
            expect(await users.getUser(fakeId)).toBeUndefined();
        } catch (e) {
            expect(e.message).toBe('User not found');
        }
    })
    test('success get user', async () => {
        try {
            await users.login(fakeId, 'ali');
            expect(await users.getUser(fakeId)).toMatchObject({
                id: fakeId,
                name: 'ali',
                isJoined: false,
                notif: [],
                room: null,
            })
        } catch (e) {
            expect(e.message).toBe('User not found');
        }
    });
})

describe('user Join', () => {
    test('fail user Join', async () => {
        try {
            expect(await users.userJoin('fakeId', 'roomId')).toBeUndefined();
        } catch (e) {
            expect(e.message).toBe('User not found')
        }
    })
    test('success user Join', async () => {
        try {
            expect(await users.userJoin(fakeId, fakeId)).toMatchObject({
                id: fakeId,
                name: 'ali',
                notif: [],
                room: fakeId
            })
        } catch (e) {
            expect(e.message).toBeUndefined();
        }
    })
})

describe('user Leave', () => {
    test('fail user leave', async () => {
        try {
            expect(await users.userLeave('fak id')).toBeUndefined();
        } catch (e) {
            expect(e.message).toBe('User not found')
        }
    })
    test('success user leave', async () => {
        try {
            expect(await users.userLeave(fakeId)).toMatchObject({
                id: fakeId,
                name: 'ali',
                isJoined: false,
                notif: [],
                room: null,
            })
        } catch (e) {
            expect(e.message).toBeUndefined();
        }
    })
})

describe('notifications', () => {
    let fakeNotif = {
        id: fakeId,
        message: 'test notifaction',
        roomId: fakeId,
        type: "invitation",
        read: false
    }

    describe('fail test', () => {
        test('fail push notification', async () => {
            try {
                expect(await users.userNotifications('fake id', fakeNotif)).toBeUndefined()
            } catch (e) {
                expect(e.message).toBe("User not found")
            }
        })

        describe('fail get notification', () => {
            test('fail user not found', async () => {
                try {
                    expect(await users.userGetNotif('fake user id', fakeId)).toBeUndefined()
                } catch (e) {
                    expect(e.message).toBe("User not found")
                }
            })
            test('fail notif not found', async () => {
                try {
                    expect(await users.userGetNotif(fakeId, 'fake user id')).toBeUndefined()
                } catch (e) {
                    expect(e.message).toBe("Notification not found")
                }
            })
        })
        describe('fail chnage notifications stauts', () => {
            test('fail notif not found', async () => {
                try {
                    expect(await users.userCahngeNotifStatus(fakeId, 'notif id', 'accepted'))
                        .toBeUndefined();
                } catch (e) {
                    expect(e.message).toBe("Notification not found")
                }
            })
        })
    })

    describe('success test', () => {
        test('success push notification', async () => {
            try {
                let notifUser = await users.userNotifications(fakeId, fakeNotif)
                expect(notifUser).toEqual(expect.objectContaining({
                    notif: expect.arrayContaining([
                        expect.objectContaining(fakeNotif)
                    ])
                }))
            } catch (e) {
                expect(e).toBeUndefined()
            }
        })
        test('success get notif', async () => {
            try {
                expect(await users.userGetNotif(fakeId, fakeId)).toMatchObject(fakeNotif)
            } catch (e) {
                expect(e).toBeUndefined()
            }
        })
        test('success change status', async () => {
            try {
                expect(await users.userCahngeNotifStatus(fakeId, fakeId, 'accepted'))
                    .toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            ...fakeNotif,
                            read: true,
                            status: 'accepted'
                        })
                    ]))
            } catch (e) {
                expect(e).toBeUndefined()
            }
        })

        test('notif is already read', async () => {
            try {
                expect(await users.userCahngeNotifStatus(fakeId, fakeId, 'accepted'))
                    .toBeUndefined()
            } catch (e) {
                expect(e.message).toBe('This notification is already read')
            }
        })
    })
})

