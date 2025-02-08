const user = require('../models/user.js');

async function handleSignup(req, res) {
  const { name , password } = req.body;
  try {
    const createdUser = await user.create({ name , password });
    if (!createdUser) {
      return res
        .status(500)
        .json({
          message: "We are sorry! Something went wrong while creating the user. Please try again later.",
          status: "failure"
        });
    }
    return res.status(201).json({
      message: "User created successfully!",
      status: "success",
    });
  } catch (error) {
    console.error("Error during user signup:", error);
    return res.status(500).json({
      message: "An error occurred during signup. Please try again later.",
      status: "failure"
    });
  }
}


async function handleLogin(req, res) {
  const { name , password } = req.body;
  try {
    const token = await user.comparePasswordAndReturnToken( name , password);
    if (!token) {
      throw new Error("Invalid username or password.");
    }
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path:'/',
      maxAge: 5 * 24 * 60 * 60 * 1000
    });
    return res.status(200).json({
      message: "Signin successful!",
      status: "success",
    });
  } catch (error) {
    return res.status(401).json({
      message: "Signin failed. Please check your username and password.",
      status: "failure",
    });
  }
}


async function handleLogout(req, res) {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
    return res.status(200).json({message: 'Logged out successfully'});
  } catch (error) {
    console.error('Error during logout:', error);
    return res.status(500).json({ error: 'Logout failed'});
  }
}





module.exports = { handleSignup, handleLogin , handleLogout};