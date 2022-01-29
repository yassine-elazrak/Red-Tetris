const request = require('supertest');
const { createApp } = require('../app'); // the express server
const app = createApp();
const {randomBytes}  = require('crypto');
const s = randomBytes(10).toString('base64').slice(0, 10);

/*
     declare the token variable in a scope accessible
     by the entire test suite
   */
let token;


beforeAll((done) => {
    // console.log("DATABASE_URL",process.env.DATABASE_URL)
    request(app)
        .post('/user/login')
        .send({
            email: "Kore@gmail.com",
            password: "1PSFgFRdR8rA96fePqgQE9TiHTV7wKuwEp",
        })
        .end((err, response) => {
            token = response.body['x-access-token'] //#.x-access-token //#.token; // save the token!
            done();
        });
    // console.log("DATABASE_URL",process.env.DATABASE_URL)

});


describe('TESTING LOGIN USER', () => {
    // token not being sent - should respond with a 401
    
    test('IT SHOULD EMAIL INCORRECT  ', () => {
        return request(app)
            .post('/user/login')
            .send({
                email: "Dassvita@gmail.com",
                password: "1EYq1GzvwJaMQkWToU8D3ACTeJ8JVAvd9V",
            })

            .then((response) => {
                expect(response.statusCode).toBe(404);
                expect(response.body).toEqual({ missage: "This email Not Found " })
            });
    });

    test('IT SHOULD PASSWORD INCORRECT ', () => {
        return request(app)
            .post('/user/login')
            .send({
                email: "Joeann@gmail.com",
                password: "1PSo2EEsG3HpfDqeULcni9h3QkmS",
            })
            .then((response) => {
                expect(response.statusCode).toBe(401);
                expect(response.body).toEqual({ missage: "Password incorrect" })
            });
    });
    test('It responds with JSON', () => {
        return request(app)
            .post('/user/login')
            .send({
                email: "Art@gmail.com",
                password: "17ucFnr2DuV7N7vuuADKp4AP2pKTPTcWF6",
            })
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        // x-access-token : expect.any(String)
                    })
                );
            });
    });
});


describe('TESTING REGISTER USER ', () => {
    // token not being sent - should respond with a 401
    test('IT SHOULD CREATE USER', () => {
        return request(app)
            .post('/user/register')
            .send({
                email: `yassine${s}@gmail.com`,
                password: "azrak",
                role: "BANK"
            })
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        // x-access-token : expect.any(String)
                    })
                );
            });
    });
    test('IT SHOULD ALREADY CREATE USER', () => {
        return request(app)
            .post('/user/register')
            .send({
                email: "Chaim@gmail.com",
                password: "16EA3kHJiV2mxgUZhhzeA9SP2GxaaTAYJR",
                role: "BANK"
            })
            .then((response) => {
                expect(response.statusCode).toBe(409);
                expect(response.body).toEqual(
                    { missage: "This email is already registered" }
                );
            });
    });
 
});