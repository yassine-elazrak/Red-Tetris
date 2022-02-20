const fakeClient = require('../clientSocket');


describe('auth', () => {
    test('login', (done) => {
        fakeClient.emit('login', null, (res, err) => {
            expect(res).toBe(null);
            expect(err).toMatchObject({
                message : 'Data is empty'
            });
            done();
            
        })
    })
})