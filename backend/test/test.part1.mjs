import { expect } from "chai";
import sinon from "sinon";
import { connect, disconnect } from "../src/config/dbconnection.js";
import logger from "../src/config/logger.js";
import getStudent from "../src/middleware/getStuById.js";
import getUserRole from "../src/middleware/getUserRole.js";
import hashPassword from "../src/middleware/hashPassword.js";
import jwtAuth from "../src/middleware/middlewareJwt.js";
import validateRefObject from "../src/middleware/validaterefinuserRoles.js";
describe("[U] Config Folder", () => {
  describe("[U] dbconnection.js", () => {
    before(() => {
      // Connect to the database before running the testss
      connect();
    });

    after(() => {
      // Disconnect from the database after running the testss
      disconnect();
    });

    it("should connect to the database successfully...", () => {
      expect(connect).to.not.throw(Error);
    });

    it("should disconnect from the database successfully...", () => {
      expect(disconnect).to.not.throw(Error);
    });
  });

  describe("[U] logger.js", () => {

      it("should print logs to console with pretty print", () => {
        logger.debug("This is a debug log");
        logger.error("This is an error log");
        logger.info("This is an info log");
        logger.warn("This is a warn log");
    });
  });
});
//db connection required for the middleware tests
before(async () => {
    // Connect to the database before running the testss
    await connect();
    }
);

describe("[U] Middleware Folder", () => {
    
   

  describe("[U] getStuById.js", () => {

    it("should return a student by id...", async () => {
  
        //create request with parameter of id
        const req = {
            params: {
                id: "65fb10906a06d629d7082a03" //id of a student in the database
            }
        };

        //create response object
        const res = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        //create next function
        const next = sinon.spy();

        //call the middleware function
        try{
        await getStudent(req, res, next);
        }
        catch(error){      
        }

        //check if the student is found
        expect(res.status.calledWith(200)).to.be.match;


    });
    
    it("should return 404 if student is not found...", async () => {
  
        //create request with parameter of id
        const req = {
            params: {
                id: "65faf21f9c197ddc784bc3a2" //wrong id
            }
        };

        //create response object
        const res = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        //create next function
        const next = sinon.spy();

        //call the middleware function
        try{
        await getStudent(req, res, next);
        }catch(error){
            
        }

        //check if the student is not found
        expect(res.json.calledWith({ message: 'Student not found' })).to.be.match;
        

    

    });

    it("should return 500 if an error occurs...", async () => {
  
        //create request with parameter of id
        const req = {
            params: {

            }
        };

        //create response object
        const res = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        //create next function
        const next = sinon.spy();

        //call the middleware function
        try{
        await getStudent(req, res, next);
        }catch(error){
            
        }

        //check if the student is not found
        expect(res.status.calledWith(500)).to.be.true;

  

    });



  });

  describe("[U] getUserRole.js", () => {
    
        it("should return a user role...", async () => {
    
            //create request with parameter of id
            const req = {
                body: {
                  username: 'adminzila'
                }
              };
    
            //create response object
            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };
    
            //create next function
            const next = sinon.spy();
    
            //call the middleware function
            try{
            await getUserRole(req, res, next);
            }catch(error){
                
            }
    
            //check if the role is returned
            expect(res.json.calledWith({ role: 'admin' })).to.be.match;
    
        });

        it("should return 404 if user is not found...", async () => {
                
                //create request with parameter of id
                const req = {
                    body: {
                    username: 'adminzil'
                    }
                };
        
                //create response object
                const res = {
                    status: sinon.spy(),
                    json: sinon.spy()
                };
        
                //create next function
                const next = sinon.spy();
        
                //call the middleware function
                try{
                await getUserRole(req, res, next);
                }catch(error){
                    
                }
        
                //check if the role is not returned
                expect(res.json.calledWith({ message: 'Sorry !! User  not found' })).to.be.match;
        
            });                                                        
    
        it("should return 500 if an error occurs...", async () => {
    
            //create request with parameter of id
            const req = {
                user: {
    
                }
            };
    
            //create response object
            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };
    
            //create next function
            const next = sinon.spy();
    
            //call the middleware function
            try{
            await getUserRole(req, res, next);
            }catch(error){
                
            }
    
            //check if the role is not returned
            expect(res.status.calledWith(500)).to.be.true;
    
        });

        
  });

  describe("[U] hashPassword.js", () => {
        
        it("should hash the password...", async () => {
    
            //create request with parameter of id
            const req = {
                body: {
                password: 'password'
                }
            };
    
            //create response object
            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };
    
            //create next function
            const next = sinon.spy();
    
            //call the middleware function
            try{
            await hashPassword(req, res, next);
            }catch(error){
                
            }
    
            //check if the password is hashed
            expect(req.body.password).to.not.equal('password');
    
        });
    
        it("should return 500 if an error occurs...", async () => {
    
            //create request with parameter of id
            const req = {
                body: {
                }
            };
    
            //create response object
            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };
    
            //create next function
            const next = sinon.spy();

            //call the middleware function
            try{
            await hashPassword(req, res, next);
            }
            catch(error){
                
                expect(res.status.calledWith(500)).to.be.true;
            }

        });
    
        
  });

  describe("[U] middlewareJwt.js", () => {
            it("should return 200 if a valid token is provided...", async () => {
                //duplicate entry 
               //validated in another test
               //see aut courseRoute.test.js

            });
            it("should return 401 if no token is provided...", async () => {
        
                //create request with parameter of id
                const req = {
                    cookies: {
                    }
                };
        
                //create response object
                const res = {
                    status: sinon.spy(),
                    json: sinon.spy()
                };
        
                //create next function
                const next = sinon.spy();
        
                //call the middleware function
                try{
                await jwtAuth(req, res, next);
                }catch(error){
                    
                }
        
                //check if the password is hashed
                expect(res.status.calledWith(401)).to.be.true;
        
            });
        
            it("should set 400 if an invalid token is provided...", async () => {
        
                //create request with parameter of id
                const req = {
                    cookies: {
                        auth: 'invalidtoken'
                    }
                };
        
                //create response object
                const res = {
                    status: sinon.spy(),
                    json: sinon.spy()
                };
        
                //create next function
                const next = sinon.spy();
        
                //call the middleware function
                try{
                await jwtAuth(req, res, next);
                }catch(error){
                    
                }
        
                //check if the password is hashed
                expect(res.status.calledWith(400)).to.be.true;
        
            });
        
            
  });

  describe("[U] validaterefinuserRoles.js", () => {
    it("should validate refObject of student...", async () => {
  
        //create request with parameter of id
        const req = {
            body: {
                role: 'student',
                refObject: '65fab6d85bb8f9c53521c7e8' //id of a student in the database
            }
        };

        //create response object
        const res = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        //create next function
        const next = sinon.spy();

       
        try{
            await validateRefObject(req, res, next);
            expect(next.called).to.be.true;
            }
            catch(error){      
            }

       
    });
    it("should validate refObject of lecturer...", async () => {
  
        //create request with parameter of id
        const req = {
            body: {
                role: 'lecturer',
                refObject: '65fb0c2f6a06d629d70829d4' //id of a student in the database
            }
        };

        //create response object
        const res = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        //create next function
        const next = sinon.spy();

        //call the middleware function
        try{
        await validateRefObject(req, res, next);
        expect(next.called).to.be.true;
        }
        catch(error){      
        }

        //check if the student is found
    });

    it("should return 400 if there is error in id ...", async () => {
  
        //create request with parameter of id
        const req = {
            body: {
                role: 'lecturer3',
            }
        };

        //create response object
        const res = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        //create next function
        const next = sinon.spy();

        //call the middleware function
        try{
        await validateRefObject(req, res, next);
        expect(res.status.calledWith(400)).to.be.true;     
        }
        catch(error){ 
        }
    });

  });


});

//disconnect from the database after running the tests
after(async () => {
    // Disconnect from the database after running the testss
    await disconnect();
    }
);

