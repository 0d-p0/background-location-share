const UserModel = require("../model/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      return res.status(303).json({
        success: false,
        message: "email and password required",
      });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("error is ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "password not match" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.checkIn = async (req, res) => {
  try {
    const { latitude, longitude, name } = req.body;
    const userId = req.userId; // Assuming userId is set in a middleware like verifyToken

    // Find the user and push a new check-in entry into the checkins array
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.checkins.push({ latitude, longitude, name });

    await user.save();

    res.status(201).json({ message: "Check-in successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.getCheckin = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is set in a middleware like verifyToken

    // Find the user by their ID and select the checkins field
    const user = await UserModel.findById(userId).select("checkins");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the check-in locations from the user document and send them in the response
    const checkinLocations = user.checkins.map((checkin) => ({
      name: checkin?.name,
      latitude: checkin.latitude,
      longitude: checkin.longitude,
      timestamp: checkin.timestamp,
    }));
    res.json(checkinLocations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
