const express = require("express");
const router = express.Router();
const studentCredential = require("../../models/Students/StudentCredentials");
const Session = require("../../models/Students/userActivity");

router.post("/login", async (req, res) => {
  let { loginid, password } = req.body;
  try {
    let user = await studentCredential.findOne({ loginid });

    if (!user || password !== user.password) {
      return res.status(400).json({ success: false, message: "Wrong Credentials" });
    }

    user.lastLogin = new Date();
    user.ipAddress = req.ip;
    await user.save();

    // Check if the user already has an active session
    let existingSession = await Session.findOne({ userId: user._id, isLoggedIn: true });

    if (existingSession) {
      // Update the existing session
      existingSession.loginTime = new Date();
      await existingSession.save();
    } else {
      // Create a new session if the user doesn't have an active session
      await Session.create({
        userId: user._id,
        isLoggedIn: true,
        loginTime: new Date(),
      });
    }

    const data = {
      success: true,
      message: "Login Successful!",
      loginid: user.loginid,
      id: user.id,
    };
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


router.post("/logout", async (req, res) => {
  let { loginid } = req.body;
  try {
    let user = await studentCredential.findOne({ loginid });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Find the corresponding user session and update it
    const userSession = await Session.findOne({ userId: user._id, isLoggedIn: true });
    if (userSession) {
      userSession.isLoggedIn = false;
      userSession.logoutTime = new Date();
      await userSession.save();
    }

    const data = {
      success: true,
      message: "Logout Successful!",
    };
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


router.post("/register", async (req, res) => {
  let { loginid, password } = req.body;
  try {
    let user = await studentCredential.findOne(req.body);
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User With This LoginId Already Exists",
      });
    }
    user = await studentCredential.create({
      loginid,
      password,
    });
    const data = {
      success: true,
      message: "Register Successfull!",
      data: {
        loginid: user.loginid,
        _id: user._id,
      },
    };
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/update/:id", async (req, res) => {
  try {
    let user = await studentCredential.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No User Exists!",
      });
    }
    const data = {
      success: true,
      message: "Updated Successfull!",
    };
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    let user = await studentCredential.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No User Exists!",
      });
    }
    const data = {
      success: true,
      message: "Deleted Successfull!",
    };
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
