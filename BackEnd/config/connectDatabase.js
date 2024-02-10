const mongoose = require("mongoose");

// MongoDB Connection
exports.connectDataBase = () => {
  try {
    mongoose.connect(`mongodb://127.0.0.1:27017/employeeLocation`).then(() => {
      console.log(`database connected`);
    });
  } catch (error) {
    console.log(`database error is 
${error}`);
  }
};
