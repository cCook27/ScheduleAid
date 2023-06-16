const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server"); 
const should = chai.should();
const expect = chai.expect;
const faker = require("faker");

chai.use(chaiHttp);

describe('Homes and Pairs', () => {
  describe('POST /homes', () => {
    it('Should Post a new client home to the db', (done) => {
      const homeToAdd = {
        name: faker.name.firstName(),
        address: {
          number: faker.commerce.price(),
          street: faker.commerce.productName(),
          city: faker.commerce.department(),
          state: faker.commerce.productName(),
          zip: faker.commerce.price(),
        },
        pairs: [],
      };

      chai
        .request(app)
        .post('/homes')
        .send(homeToAdd)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.eql(homeToAdd);
          done();
        })
    });

  });

  describe('GET /homes', () => {
    it('Should get all the homes in the db', (done) => {
      chai
        .request(app)
        .get('/homes')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        })
    });

  });
});