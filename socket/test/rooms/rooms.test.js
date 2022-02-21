const roomsClass = require('../../src/rooms/rooms')
const usersClass = require('../../src/users/users')
const rooms = new roomsClass();
const users = new usersClass();

const fakeId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
let user;
// console.log(user)
beforeAll(async () => {
    user = await users.login(fakeId, 'ali')
    // console.log(user);
})
test('create new class', () => {
    expect(new roomsClass()).toBe(rooms)
})

describe('rooms tes', () => {
    let roomData = {
        roomName: ' room ',
        isPrivate: true,
    }
    describe('success create room', () => {
        test('create private room', async () => {
            try {
                let newRoom = await rooms.createRoom(roomData, user)
                expect(newRoom).toMatchObject({
                    id: expect.any(String),
                    name: 'room',
                    admin: user.id,
                    status: 'closed',
                    ids: expect.arrayContaining([user.id]),
                    users: expect.any(Array),
                    invit: expect.any(Array),
                })
            } catch (e) {
                expect(e).toBeUndefined()
            }
        })

        test('create public room', async () => {
            try {
                let newRoom = await rooms.createRoom({
                roomName: 'room2',
                isPrivate: false,
                }, user)
                expect(newRoom).toMatchObject({
                    id: expect.any(String),
                    name: 'room2',
                    admin: user.id,
                    status: 'waiting',
                    ids: expect.arrayContaining([user.id]),
                    users: expect.any(Array),
                    invit: expect.any(Array),
                })
            } catch (e) {
                expect(e).toBe(null)
            }
        })

    })


    describe('fail create room', () => {
        
    })


})