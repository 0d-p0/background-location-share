const { http, io } = require("./app");
const { connectDataBase } = require("./config/connectDatabase");

connectDataBase();
http.listen(4000, () => {
  console.log("server run");
});
