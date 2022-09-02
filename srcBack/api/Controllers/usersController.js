// import UsersDAO from "../../DAO/usersDAO.js";
// import bcrypt from "bcryptjs";
// import pkg from "jsonwebtoken";

// const {jwt} = pkg;

// const hashPassword = async (password) => await bcrypt.hash(password, 10);

// export class User {
//   constructor({email, password, profile = {}} = {}) {
//     this.email = email;
//     this.password = password;
//     this.profile = profile;
//   }
//   toJson() {
//     return {email: this.email, profile: this.profile};
//   }
//   async comparePassword(plainText) {
//     return await bcrypt.compare(plainText, this.password);
//   }
//   encoded() {
//     return jwt.sign(
//       {
//         exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
//         ...this.toJson(),
//       },
//       process.env.SECRET_ENV
//     );
//   }
//   static async decoded(userJwt) {
//     return jwt.verify(userJwt, process.env.SECRET_ENV, (error, res) => {
//       if (error) {
//         return {error};
//       }
//       return new User(res);
//     });
//   }
// }

// export default class UserController {
//   static async register(req, res) {
//     try {
//       const userFromBody = req.body;
//       let errors = {};
//       if (userFromBody && userFromBody.password.length < 8) {
//         errors.password = "Your password must be at least 8 characters.";
//       }
//       if (Object.keys(errors).length > 0) {
//         res.status(400).json(errors);
//         return;
//       }

//       const userInfo = {
//         ...userFromBody,
//         password: await hashPassword(userFromBody.password),
//       };

//       const insertResult = await UsersDAO.addUser(userInfo);
//       if (!insertResult.success) {
//         errors.email = insertResult.error;
//       }

//       const userFromDB = await UsersDAO.getUser(userFromBody.email);
//       if (!userFromDB) {
//         errors.general = "Internal error, please try again later";
//       }

//       if (Object.keys(errors).length > 0) {
//         res.status(400).json(errors);
//         return;
//       }

//       const user = new User(userFromDB);
//       console.log(user);
//       res.json({
//         auth_token: user.encoded(),
//         info: user.toJson(),
//       });
//     } catch (error) {
//       res.status(500).json({error: error});
//     }
//   }

//   static async login(req, res, next) {
//     try {
//       const {email, password} = req.body;

//       if (!email || typeof email !== "string") {
//         res.status(400).json({error: "Incorrect email format"});
//         return;
//       }
//       if (!password || typeof password !== "string") {
//         res.status(400).json({error: "Incorrect password format."});
//         return;
//       }

//       let userData = await UsersDAO.getUser(email);

//       if (!userData) {
//         res.status(401).json({
//           error: `${email} not found! Please make sure your email is correct.`,
//         });
//         return;
//       }
//       const user = new User(userData);

//       console.log(user);

//       if (!(await user.comparePassword(password))) {
//         res.status(401).json({error: "Make sure your password is correct."});
//         return;
//       }

//       const loginResponse = await UsersDAO.loginUser(
//         user.email,
//         user.password
//         // user.encoded()
//       );

//       if (!loginResponse.success) {
//         res.status(500).json({error: loginResponse.error});
//         return;
//       }
//       res.json({auth_token: user.encoded(), info: user.toJson()});
//     } catch (error) {
//       res.status(400).json({error: error});
//       return;
//     }
//   }
//   static async logout(req, res) {
//     try {
//       const userJwt = req.get("Authorization").slice("Bearer ".length);
//       const userObj = await User.decoded(userJwt);
//       var {error} = userObj;
//       if (error) {
//         res.status(401).json({error});
//         return;
//       }
//       const logoutResult = await UsersDAO.logoutUser(userObj.email);
//       var {err} = logoutResult;
//       if (err) {
//         res.status(500).json({err});
//         return;
//       }
//       res.json(logoutResult);
//     } catch (e) {
//       res.status(500).json(e);
//     }
//   }
//   static async delete(req, res) {
//     try {
//       let {password} = req.body;
//       if (!password || typeof password !== "string") {
//         res.status(400).json({error: "Make sure your password is correct."});
//         return;
//       }
//       const userJwt = req.get("Authorization").slice("Bearer ".length);
//       const userClaim = await User.decoded(userJwt);
//       var {error} = userClaim;
//       if (error) {
//         res.status(401).json({error});
//         return;
//       }
//       const user = new User(await UsersDAO.getUser(userClaim.email));
//       if (!(await user.comparePassword(password))) {
//         res.status(401).json({error: "Make sure your password is correct."});
//         return;
//       }
//       const deleteResult = await UsersDAO.deleteUser(userClaim.email);
//       var {err} = deleteResult;
//       if (err) {
//         res.status(500).json({err});
//         return;
//       }
//       res.json(deleteResult);
//     } catch (e) {
//       res.status(500).json(e);
//     }
//   }
//   static async save(req, res) {
//     try {
//       const userJwt = req.get("Authorization").slice("Bearer ".length);
//       console.log(userJwt);
//       const userFromHeader = await User.decoded(userJwt);
//       var {error} = userFromHeader;
//       if (error) {
//         res.status(401).json({error});
//         return;
//       }
//       console.log(userJwt);

//       await UsersDAO.updateProfile(userFromHeader.email, req.body.profile);
//       const userFromDB = await UsersDAO.getUser(userFromHeader.email);
//       const updatedUser = new User(userFromDB);

//       res.json({
//         auth_token: updatedUser.encoded(),
//         info: updatedUser.toJson(),
//       });
//     } catch (e) {
//       res.status(500).json(e);
//     }
//   }
// }

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UsersDAO from "../../DAO/usersDAO.js";

const hashPassword = async (password) => await bcrypt.hash(password, 10);

export class User {
  constructor({email, password = {}} = {}) {
    this.email = email;
    this.password = password;
  }
  toJson() {
    return {email: this.email};
  }
  async comparePassword(plainText) {
    return await bcrypt.compare(plainText, this.password);
  }
  encoded() {
    return jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
        ...this.toJson(),
      },
      process.env.SECRET_KEY
    );
  }
  static async decoded(userJwt) {
    return jwt.verify(userJwt, process.env.SECRET_KEY, (error, res) => {
      if (error) {
        return {error};
      }
      return new User(res);
    });
  }
}

export default class UserController {
  static async register(req, res) {
    try {
      const userFromBody = req.body;

      let errors = {};
      if (userFromBody && userFromBody.password.length < 8) {
        errors.password = "Your password must be at least 8 characters.";
      }

      if (await UsersDAO.getUser(userFromBody.email)) {
        errors.email = `${userFromBody.email} already exists`;
      }

      if (Object.keys(errors).length > 0) {
        res.status(400).json(errors);
        return;
      }

      const userInfo = {
        ...userFromBody,
        password: await hashPassword(userFromBody.password),
      };

      const insertResult = await UsersDAO.addUser(userInfo);
      if (!insertResult.success) {
        errors.email = insertResult.error;
      }
      console.log(insertResult);
      const userFromDB = await UsersDAO.getUser(userFromBody.email);
      if (!userFromDB) {
        errors.general = "Internal error, please try again later";
      }

      const user = new User(userFromDB);

      res.json({
        auth_token: user.encoded(),
        info: user.toJson(),
      });
    } catch (e) {
      res.status(500).json({error: e});
    }
  }

  static async login(req, res, next) {
    try {
      const {email, password} = req.body;
      if (!email || typeof email !== "string") {
        res.status(400).json({error: "Bad email format, expected string."});
        return;
      }
      if (!password || typeof password !== "string") {
        res.status(400).json({error: "Bad password format, expected string."});
        return;
      }
      let userData = await UsersDAO.getUser(email);
      if (!userData) {
        res.status(401).json({error: "Make sure your email is correct."});
        return;
      }
      const user = new User(userData);

      if (!(await user.comparePassword(password))) {
        res.status(401).json({error: "Make sure your password is correct."});
        return;
      }

      const loginResponse = await UsersDAO.loginUser(
        user.email,
        user.encoded()
      );
      if (!loginResponse.success) {
        res.status(500).json({error: loginResponse.error});
        return;
      }
      res.json({auth_token: user.encoded(), info: user.toJson()});
    } catch (e) {
      res.status(400).json({error: e});
      return;
    }
  }

  static async logout(req, res) {
    try {
      const userJwt = req.get("Authorization").slice("Bearer ".length);
      const userObj = await User.decoded(userJwt);
      var {error} = userObj;
      if (error) {
        res.status(401).json({error});
        return;
      }
      const logoutResult = await UsersDAO.logoutUser(userObj.email);
      var {error} = logoutResult;
      if (error) {
        res.status(500).json({error});
        return;
      }
      res.json(logoutResult);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  static async delete(req, res) {
    try {
      let {password} = req.body;
      if (!password || typeof password !== "string") {
        res.status(400).json({error: "Bad password format, expected string."});
        return;
      }
      const userJwt = req.get("Authorization").slice("Bearer ".length);
      const userClaim = await User.decoded(userJwt);
      var {error} = userClaim;
      if (error) {
        res.status(401).json({error});
        return;
      }
      const user = new User(await UsersDAO.getUser(userClaim.email));
      if (!(await user.comparePassword(password))) {
        res.status(401).json({error: "Make sure your password is correct."});
        return;
      }
      const deleteResult = await UsersDAO.deleteUser(userClaim.email);
      var {error} = deleteResult;
      if (error) {
        res.status(500).json({error});
        return;
      }
      res.json(deleteResult);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  static async save(req, res) {
    try {
      await UsersDAO.updateProfile(req.body.email, req.body.profile);
      const userFromDB = await UsersDAO.getUser(req.body.email);
      console.log(userFromDB);
      const updatedUser = new User(userFromDB);

      res.json({
        auth_token: updatedUser.encoded(),
        info: updatedUser.toJson(),
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }

  // for internal use only
  static async createAdminUser(req, res) {
    try {
      const userFromBody = req.body;
      let errors = {};
      if (userFromBody && userFromBody.password.length < 8) {
        errors.password = "Your password must be at least 8 characters.";
      }
      if (userFromBody && userFromBody.name.length < 3) {
        errors.name = "You must specify a name of at least 3 characters.";
      }

      if (Object.keys(errors).length > 0) {
        res.status(400).json(errors);
        return;
      }

      const userInfo = {
        ...userFromBody,
        password: await hashPassword(userFromBody.password),
      };

      const insertResult = await UsersDAO.addUser(userInfo);
      if (!insertResult.success) {
        errors.email = insertResult.error;
      }

      if (Object.keys(errors).length > 0) {
        res.status(400).json(errors);
        return;
      }

      const makeAdminResponse = await UsersDAO.makeAdmin(userFromBody.email);

      const userFromDB = await UsersDAO.getUser(userFromBody.email);
      if (!userFromDB) {
        errors.general = "Internal error, please try again later";
      }

      if (Object.keys(errors).length > 0) {
        res.status(400).json(errors);
        return;
      }

      const user = new User(userFromDB);
      const jwt = user.encoded();
      const loginResponse = await UsersDAO.loginUser(user.email, jwt);

      res.json({
        auth_token: jwt,
        info: user.toJson(),
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }
}
