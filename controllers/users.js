const Users = require('../models/Users');
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup = (req, res) => {
    // check is any user with same email already exist or not
    User.findOne({ email: req.body.email }).exec((err, user) => {
      if (user) {
        return res.status(400).json({
          error: "email is already exist",
        });
      }
  
      // get details from body
      const { name, email, password } = req.body;
  
      // create a user with provided details
      let newUser = new Users({
        name,
        email,
        password
      });
  
      // save the user details into database
      newUser.save((err, success) => {
        if (err) {
          return res.status(400).json({
            error: err,
          });
        }
  
        res.json({
          message: "Signup succesfull. Please SignIn.",
        });
      });
    });
  };
  
  exports.signin = (req, res) => {
    const { email, password } = req.body;
  
    //check if user exists
    Users.findOne({ email }).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User with this email does not exist. Please signup.",
        });
      }
  
      // authenticate
      if (!user.authenticate(password)) {
        return res.status(400).json({
          error: "Email or password did not matched",
        });
      }
  
      // generate a token and send to  client
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
  
      res.cookie("token", token, { expiresIn: "1d" });
      const { _id, name, email } = user;
      return res.json({
        token,
        user: { _id, name, email },
      });
    });
  };
  
  exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({
      message: "Signout sucess",
    });
  };
  
  exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
  });
  
  exports.authMiddleware = (req, res, next) => {
    const authUserId = req.user._id;
    User.findById({ _id: authUserId }).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
  
      req.profile = user;
      next();
    });
  };

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.query.userId
        const result = await Users.findByIdAndDelete({ id: userId })
        res.status(200).json({ message: 'User deleted', result: result })
    } catch(error) {
        console.log('error in deleting user ', error)
        res.status(400).json({ message: 'Error in deleting user', error: error})
    }
}

exports.updateUser = async (req, res) => {
    try {
        const id = req.query.id
        const user = await Users.findById(id)
        if(!user) {
            res.status(404).json({ message: 'User not found, wrong user id '})
        }
        const email = req.body.email
        if(email) {
            res.status(405).json({ message: 'email cannot be updated' })
        }

        const result = await Users.findByIdAndUpdate({id: id}, {
            name: req.body.name ? req.body.name : user.name,
            password: req.body.password ? req.body.password : user.password
        })
        res.status(200).json({ message: 'User updated', result: result })
    } catch(error) {
        console.log('error in updating user ', error)
        res.status(400).json({ message: 'Error in updating user', error: error})
    }
}
