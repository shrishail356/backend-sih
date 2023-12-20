const connectToMongo = require("./Database/db");
const express = require("express");
const app = express();
connectToMongo();
const port = 5000 || process.env.PORT;
var cors = require("cors");

app.use(cors());
app.use(express.json()); //to convert request data to json

// Credential Apis
app.use("/api/user/auth", require("./routes/Student Api/studentCredential"));
app.use("/api/admin/auth", require("./routes/Admin Api/adminCredential"));
// Details Apis
app.use("/api/user/details", require("./routes/Student Api/studentDetails"));
app.use("/api/admin/details", require("./routes/Admin Api/adminDetails"));
app.listen(port, () => {
  console.log(`Server Listening On http://localhost:${port}`);
});
