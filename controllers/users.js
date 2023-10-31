const Users = require('../models/Users');
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup = async (req, res) => {
    try{
        // check is any user with same email already exist or not
        const user = await Users.findOne({ email: req.body.email })
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
        const result = newUser.save()
        res.status(200).json({ message: "Signup succesfull. Please SignIn.", result: result });
    } catch(error) {
        console.log('error in signing up ', error)
        res.status(400).json({ message: 'error in siging up', error: error })
    }
  };
  
  exports.signin = async (req, res) => {
    try {
        let { email, password } = req.body;

        //check if user exists
        const user = await Users.findOne({ email })
        if (!user) {
            return res.status(404).json({
                error: "User with this email does not exist. Please signup.",
            });
        }

        // authenticate
        if (user.password !== password) {
            return res.status(400).json({
                error: "Email or password did not matched",
            });
        }

        // generate a token and send to  client
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.cookie("token", token, { expiresIn: "1d" });

        return res.json({
            token,
            user: user,
        });
    } catch(error) {
        console.log('error in signing in ', error)
        res.status(400).json({ message: 'error in signing in ', error: error })
    }
  };
  
  exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({
      message: "Signout sucess",
    });
  };
  
  exports.authMiddleware = async (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization
        if (!bearerToken) {
          return res.status(401).json({ error: 'User unauthorized' })
        }
        const token = bearerToken.split(' ').length > 1 ? bearerToken.split(' ')[1] : bearerToken
        var decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded) 
        const user = await Users.findById(decoded._id)
        if(!user) {
            res.status(404).json({ message: 'No such user'})
        }
        req.user = decoded
        return next()
    } catch(error) {
        console.log('error in middleware ', error)
        res.status(400).json({ message: 'Error in middleware', error: error })
    }
  };

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.query.userId
        //finding and deleting the user
        const result = await Users.findByIdAndDelete({ id: userId })
        res.status(200).json({ message: 'User deleted', result: result })
    } catch(error) {
        console.log('error in deleting user ', error)
        res.status(400).json({ message: 'Error in deleting user', error: error})
    }
}

exports.updateUser = async (req, res) => {
    try {
        const id = req.user._id

        //checking if the user exist
        const user = await Users.findOne({_id: id})
        if(!user) {
            res.status(404).json({ message: 'User not found, wrong user id '})
        }

        //email cannot be updated
        const email = req.body.email
        if(email) {
            return res.status(405).json({ message: 'email cannot be updated' })
        }

        //updating user details
        const result = await Users.findByIdAndUpdate({_id: id}, {
            name: req.body.name ? req.body.name : user.name,
            password: req.body.password ? req.body.password : user.password
        })
        res.status(200).json({ message: 'User updated', result: result })
    } catch(error) {
        console.log('error in updating user ', error)
        res.status(400).json({ message: 'Error in updating user', error: error})
    }
}
