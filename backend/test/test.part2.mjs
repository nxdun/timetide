import app from "../src/server.js"; // Assuming your Express app is exported as 'app'
import supertest from "supertest";
import { expect } from "chai";
import UserRoles from "../src/models/userRolesSchema.js";
import logger from "../src/config/logger.js";
let authCookie; // To store the 'auth' cookie
const request = supertest(app);
describe("[U + I]  AuthRouter.js  Tests", () => {
  describe("[U + I]  /v1/auth/login/ POST", () => {
    it("should return 400 if user is already logged in", async () => {
      try {
        const res = await request
          .post("/v1/auth/login/")
          //set auth cookie
          .set("Cookie", "auth=poop")
          .send({ username: "adminzila", password: "testpassword" });

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property("message", "User already logged in");
      } catch (error) {
        throw error;
      }
    });

    it("should return 400 and all fields required", async () => {
      try {
        const res = await request
          .post("/v1/auth/login/")
          .send({ username: "adminzila" });

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property("message", "All fields are required");
      } catch (error) {
        throw error;
      }
    });

    it("should return 404 if user not found", async () => {
      try {
        const res = await request
          .post("/v1/auth/login/")
          .send({ username: "adminzilaA", password: "testpassword" });

        expect(res.status).to.equal(404);
        expect(res.body).to.have.property(
          "message",
          "Sorry !! User  not found"
        );
      } catch (error) {
        throw error;
      }
    });

    it("should return 401 if password is incorrect", async () => {
      try {
        const res = await request
          .post("/v1/auth/login/")
          .send({ username: "adminzila", password: "testpasswordA" });

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property("message", "Invalid credentials");
      } catch (error) {
        throw error;
      }
    });

    it("should return 200 if login is successful", async () => {
      try {
        const res = await request
          .post("/v1/auth/login/")
          .send({ username: "adminzila", password: "godzila" });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message", "Login successful");
      } catch (error) {
        throw error;
      }
    });
  });

  describe("[U + I]  /v1/auth/register/ POST", () => {
    //try logging out first
    it("should return 400 if user is already logged in", async () => {
      try {
        const res = await request
          .post("/v1/auth/register/")
          //set auth cookie
          .set("Cookie", "auth=poop")
          .send({
            username: "admila",
            password: "tepassword",
            role: "lecturer",
          });

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property("message", "try logging out first");
      } catch (error) {
        throw error;
      }
    });

    //all fields are required
    it("should return 400 and all fields required", async () => {
      try {
        const res = await request
          .post("/v1/auth/register/")
          .send({ username: "admila" });

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property(
          "message",
          "All fields are required to proceed"
        );
      } catch (error) {
        throw error;
      }
    });

    //Unauthorized Operation
    it("should return 400 if unauthorized operation", async () => {
      try {
        const res = await request
          .post("/v1/auth/register/")
          .send({ username: "admila", password: "tepassword", role: "admin" });

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property("message", "Unauthorized Operation");
      } catch (error) {
        throw error;
      }
    });

    //suceessful registration
    it("should return 200 if Register is successful", async () => {
      try {
        const res = await request
          .post("/v1/auth/register/")
          .send({
            username: "AB123452",
            password: "student1",
            role: "student",
          });

        expect(res.status).to.equal(200);
      } catch (error) {
        throw error;
      }

      //remove created user
      const user = await UserRoles.deleteOne({ username: "AB123452" });
    });
  });

  describe("[U + I]  /v1/auth/logout GET", () => {
    it("should return 200 if logout is successful", async () => {
      try {
        const res = await request
          .get("/v1/auth/logout")
          .set("Cookie", "auth=poop");

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message", "Logout successful");
      } catch (error) {
        throw error;
      }
    });
  });

  describe("[U + I]  /v1/auth/logout POST", () => {
    it("should return 200 if logout is successful", async () => {
      try {
        const res = await request
          .post("/v1/auth/logout")
          .set("Cookie", "auth=poop");

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message", "Logout successful");
      } catch (error) {
        throw error;
      }
    });
  });

  describe("[U + I]  /v1/auth/validate POST", () => {
    it("should return 401 if user is not logged in", async () => {
      try {
        const res = await request
          .post("/v1/auth/validate")
          .send({ username: "adminzila", password: "testpassword" });

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property(
          "message",
          "Access denied. No token provided."
        );
      } catch (error) {
        throw error;
      }
    });

    it("should return 200 if user is logged in", async () => {
      try {
        const res = await request
          .post("/v1/auth/login/")
          .send({ username: "adminzila", password: "godzila", role: "admin" });

        //get the cookie
        const cookie = res.header["set-cookie"][0];
        const res2 = await request
          .post("/v1/auth/validate")
          .set("Cookie", cookie)
          .send({ username: "adminzila", role: "admin" });
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message", "Login successful");
      } catch (error) {
        throw error;
      }
    });
  });
});

describe("[U + I]  AuthRouter.js Integration Tests", () => {
  describe("[U + I]  /v1/auth/login/ POST", () => {
    it("should return 400 by MiddleWare if user is already logged in...", async () => {
      try {
        const res = await request
          .post("/v1/auth/login/")
          //set auth cookie
          .set("Cookie", "auth=poop")
          .send({ username: "adminzila", password: "testpassword" });

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property("message", "User already logged in");
      } catch (error) {
        throw error;
      }
    });

    it("should return 400 by Middleware and all fields required...", async () => {
      try {
        const res = await request
          .post("/v1/auth/login/")
          .send({ username: "adminzila" });

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property("message", "All fields are required");
      } catch (error) {
        throw error;
      }
    });

    it("should return 404 if user not found...", async () => {
      try {
        const res = await request
          .post("/v1/auth/login/")
          .send({ username: "adminzilaA", password: "testpassword" });

        expect(res.status).to.equal(404);
        expect(res.body).to.have.property(
          "message",
          "Sorry !! User  not found"
        );
      } catch (error) {
        throw error;
      }
    });

    it("should return 401 if password is incorrect...", async () => {
      try {
        const res = await request
          .post("/v1/auth/login/")
          .send({ username: "adminzila", password: "testpasswordA" });

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property("message", "Invalid credentials");
      } catch (error) {
        throw error;
      }
    });

    it("should return 200 and set token if login is successful...", async () => {
      try {
        const res = await request
          .post("/v1/auth/login/")
          .send({ username: "adminzila", password: "godzila" });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message", "Login successful");
      } catch (error) {
        throw error;
      }
    });
  });

});

describe("[U + I] bookingsRoutes.js tests", () => {
  
  //taking admin cookie

  before(async () => {
    const res = await request
      .post("/v1/auth/login/")
      .send({ username: "adminzila", password: "godzila", role: "admin" });

    // Retrieve the cookies from the response headers
    const cookies = res.headers["set-cookie"];
    // Find and extract the 'auth' cookie
    authCookie = cookies
    .find((cookie) => cookie.startsWith("auth"))
    .split(";")[0];
    logger.info(`[test2] authCookie: ${authCookie}`);
  });

 

  describe("GET /v1/api/bookings/", () => {
    it("should return 200 and all bookings", async () => {
      // Make the request and include the auth cookie in the headers
      const res = await request
        .get("/v1/api/bookings/")
        .set("Cookie", authCookie);

      expect(res.statusCode).to.equal(200);
    });
  });

  let postedId;

  describe("POST /v1/api/bookings/ ", () => {
    it("should return 400 Hall not found", async () => {
      const res = await request
        .post("/v1/api/bookings/")
        .set("Cookie", authCookie)
        .send({
          StartTime: "2020-12-10T12:00:00.000Z",
          EndTime: "2020-12-12T14:00:00.000Z",
          BookedDay: "2020-12-12",
          Course: "65faebeb967f8323ca27f1d8", 
          Type: "lecture",
          hall: "99fb0b026a06d629d70829c7",//incorrect id
        });

      expect(res.statusCode).to.equal(400);
    });

    it("should return 201 Success", async () => {
      const res = await request
        .post("/v1/api/bookings/")
        .set("Cookie", authCookie)
        .send({
          StartTime: "2000-12-10T12:00:00.000Z",
          EndTime: "2000-12-12T14:00:00.000Z",
          BookedDay: "2000-12-12",
          Course: "65faebeb967f8323ca27f1d8",
          Type: "Lecture",
          hall: "65fb0b026a06d629d70829c7",//correct id
        });

      postedId = res.body._id;
      logger.info(`[ttest2] postedId: ${postedId}`);

      expect(res.statusCode).to.equal(201);
    });

    it("should return 400 Invalid Course id", async () => {
      const res = await request
        .post("/v1/api/bookings/")
        .set("Cookie", authCookie)
        .send({
          StartTime: "2020-12-10T12:00:00.000Z",
          EndTime: "2020-12-12T14:00:00.000Z",
          BookedDay: "2020-12-12",
          Course: "65faebeb967f8323ca27f1a9",//incorrect id
          Type: "Lecture",
          hall: "65fb0b0c6a06d629d70829c9",
        });

      expect(res.statusCode).to.equal(400);
    });

    it("should return 400 and all fields required", async () => {
      const res = await request
        .post("/v1/api/bookings/")
        .set("Cookie", authCookie)
        .send({
          StartTime: "2020-12-10T12:00:00.000Z",
          EndTime: "2020-12-12T14:00:00.000Z",
          BookedDay: "2020-12-12",
          Course: "65faebeb967f8323ca27f1d8",
          Type: "lecture",
        });

      expect(res.statusCode).to.equal(400);
    });

    it("should return 401 Unauthorized", async () => {
      const res = await request
        .post("/v1/api/bookings/")
        .send({
          StartTime: "2020-12-10T12:00:00.000Z",
          EndTime: "2020-12-12T14:00:00.000Z",
          BookedDay: "2020-12-12",
          Course: "65faebeb967f8323ca27f1d8",
          Type: "lecture",
          hall: "65fb0b0c6a06d629d70829c9",
        });

      expect(res.statusCode).to.equal(401);
    });





  });

  describe("GET /v1/api/bookings/:id", () => {
    it("should return 500 server error", async () => {
      // Make the request and include the auth cookie in the headers
      const res = await request
        .get("/v1/api/bookings/5fb0b0c6a06d629d70829c9")
        .set("Cookie", authCookie);

      expect(res.statusCode).to.equal(500);
    });

    it("should return 200 and a booking", async () => {
      // Make the request and include the auth cookie in the headers
      const res = await request
        .get("/v1/api/bookings/65faea667df21575d10c74b5")
        .set("Cookie", authCookie);

      expect(res.statusCode).to.equal(200);
    });

  });

  describe("PATCH /v1/api/bookings/:id", () => {
    it("should return 400 Hall not found", async () => {
      const res = await request
        .patch(`/v1/api/bookings/${postedId}`)
        .set("Cookie", authCookie)
        .send({
          StartTime: "2000-12-10T12:00:00.000Z",
          EndTime: "2000-12-12T14:00:00.000Z",
          BookedDay: "2000-12-12",
          Course: "66faebeb967f8323ca27f1d8",
          Type: "Lecture",
          hall: "65fb0b026a06d629d70829c7",//incorrect id
        });

      expect(res.statusCode).to.equal(400);
    });

    it("should return 200 Success", async () => {
      const res = await request
        .patch(`/v1/api/bookings/${postedId}`)
        .set("Cookie", authCookie)
        .send({
          StartTime: "2000-12-10T12:00:00.000Z",
          EndTime: "2000-12-12T15:00:00.000Z",
          BookedDay: "2000-12-12",
          Course: "65faebeb967f8323ca27f1d8",
          Type: "Lecture",
          hall: "65fb0b026a06d629d70829c7",
        });

      expect(res.statusCode).to.equal(200);
    });

    it("should return 400 Invalid Course id", async () => {
      const res = await request
        .patch(`/v1/api/bookings/${postedId}`)
        .set("Cookie", authCookie)
        .send({
          StartTime: "2020-12-10T12:00:00.000Z",
          EndTime: "2020-12-12T14:00:00.000Z",
          BookedDay: "2020-12-12",
          Course: "65fadbeb967f8323ca27f1d8",//incorrect id
          Type: "Lecture",
          hall: "65fb0b0c6a06d629d70829c9",
        });

      expect(res.statusCode).to.equal(400);
    });

    it("should return 400 and all fields required", async () => {
      const res = await request
        .patch(`/v1/api/bookings/${postedId}`)
        .set("Cookie", authCookie)
        .send({
          StartTime: "2020-12-10T12:00:00.000Z",
          EndTime: "2020-12-12T14:00:00.000Z",
          BookedDay: "2020-12-12",
          Type: "lecture",
        });

      expect(res.statusCode).to.equal(400);
    });
  });


  describe("DELETE /v1/api/bookings/:id", () => {
  
    it("should return 500 server error", async () => {
      // Make the request and include the auth cookie in the headers
      const res = await request
        .delete("/v1/api/bookings/5fb0b0c6a06d629d70829c9")
        .set("Cookie", authCookie);

      expect(res.statusCode).to.equal(500);
    });

    it("should return 200 and a booking", async () => {
      logger.info(`[poop]/v1/api/bookings/${postedId}`);
      // Make the request and include the auth cookie in the headers
      const res = await request
        .delete(`/v1/api/bookings/${postedId}`)
        .set("Cookie", authCookie);

      expect(res.statusCode).to.equal(200);
    });

  });

});


describe("[U + I] courseRoutes.JS tests", () => {
  
  //taking admin cookie
  //BEFORE IS UNIT TEST
  before(async () => {
    const res = await request
      .post("/v1/auth/login/")
      .send({ username: "adminzila", password: "godzila", role: "admin" });

    // Retrieve the cookies from the response headers
    const cookies = res.headers["set-cookie"];
    // Find and extract the 'auth' cookie
    authCookie = cookies
    .find((cookie) => cookie.startsWith("auth"))
    .split(";")[0];
    logger.info(`[test2] authCookie: ${authCookie}`);
  });


  describe("[I] GET /v1/api/courses/", () => {
    it("should return 200 and all courses", async () => {
      // Make the request and include the auth cookie in the headers
      const res = await request
        .get("/v1/api/courses/")
        .set("Cookie", authCookie);

      expect(res.statusCode).to.equal(200);
    });
  });
  let postedCid;
  describe("[I] POST /v1/api/courses/", () => { // <-- Corrected here
    it("should return 401 Unauthorized", async () => {
      const res = await request
        .post("/v1/api/courses/")
        .send({
          name: "course1",
          code: "c1",
          description: "course1",
          creditHours: 3,
          department: "65faebeb967f8323ca27f1d8",
        });

      expect(res.statusCode).to.equal(401);
    });

    it("should return contains invalid ObjectId", async () => {
      const res = await request
        .post("/v1/api/courses/")
        .set("Cookie", authCookie)
        .send({
          Ccode: "c1",
          description: "course1",
          credits: 3,
          lecturerobjects: ["75fb0c526a06d629d70829d6"],//incorrect id
          schedule: [
            "75fb0f836a06d629d70829ec",
            "75fae7252d99e2497cd4f14d", 
        ]
        });

      expect(res.statusCode).to.equal(400);
    });

  
    it("should return 201 Success", async () => {
      const res = await request
        .post("/v1/api/courses/")
        .set("Cookie", authCookie)
        .send({
          Ccode: "c1",
          description: "course1",
          credits: 3,
          lecturerobjects: ["65f95b96d239b95696d4e909"],//correct id
          schedule: [
            "65fba8d8658b10d843e0c97c",
            "65fbbbc749b59e29fd39277f", 
        ]
        });
      postedCid = res.body._id;
      logger.info(`[CCCCCCCCCCCCCCC] postedCid: ${postedCid}`);

      expect(res.statusCode).to.equal(201);
    });
 });

 describe("[I] DELETE /v1/api/courses/:id", () => {

  //unauthorized
  it("should return 401 Unauthorized", async () => {
    const res = await request
      .delete("/v1/api/courses/5fb0b0c6a06d629d70829c9")
      .send({
        name: "course1",
        code: "c1",
        description: "course1",
        creditHours: 3,
        department: "65faebeb967f8323ca27f1d8",
      });

    expect(res.statusCode).to.equal(401);
  });

  it("should return 500 server error", async () => {
    // Make the request and include the auth cookie in the headers
    const res = await request
      .delete("/v1/api/courses/5fb0b0c6a06d629d70829c9")
      .set("Cookie", authCookie);

    expect(res.statusCode).to.equal(500);
  });

  it("should return 200 and a course", async () => {
    logger.info(`[poop]/v1/api/courses/${postedCid}`);
    // Make the request and include the auth cookie in the headers
    const res = await request
      .delete(`/v1/api/courses/${postedCid}`)
      .set("Cookie", authCookie);

    expect(res.statusCode).to.equal(200);
  });
});

});


   

   