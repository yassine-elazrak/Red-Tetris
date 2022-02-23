// const io = require('socket.io')(1347);
// const Client = require("socket.io-client");
const authClass = require('../../src/controller/authController')
const initSocket = require('../initSocket')


describe("auth test", () => {
    let serverSocket, clientSocket, auth, socket;

    beforeAll(async () => {
        try {
            socket = await initSocket.befor();
            expect(socket).toMatchObject({
                io: expect.any(Object),
                serverSocket: expect.any(Object),
                clientSocket: expect.any(Object),
            })
            auth = new authClass(socket.io)
        } catch (e) {
            console.log(e)
        }
    });

    afterAll(() => {
        initSocket.after();
    });

    describe('success login', () => {
        test('login', (done) => {
            auth.login(socket.serverSocket)('ali', (res, err) => {
                expect(res).toMatchObject({
                    id: expect.any(String),
                    name: 'ali',
                    isJoined: false,
                    notif: [],
                    room: null,
                })
                done();
            })
        })
    });

    describe('fail login', () => {
        test('empty data', (done) => {
            auth.login(socket.serverSocket)('', (res, err) => {
                expect(err).toMatchObject({
                    message: 'Please enter a valid name',
                })
                done()
            })
        })
        test('invalid data', (done) => {
            auth.login(socket.serverSocket)('----@', (res, err) => {
                expect(err).toMatchObject({
                    message: 'Please enter a valid name',
                })
                done()
            })
        })
        test('name is already token', (done) => {
            auth.login(socket.serverSocket)('ali', (res, err) => {
                expect(err).toMatchObject({
                    message: 'Username is already taken',
                })
                done()
            })
        })
    })

});