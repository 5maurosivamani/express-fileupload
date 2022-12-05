const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dirTree = require("directory-tree");

require("dotenv/config");

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/", (req, res) => {
  const tree = dirTree("./");
  res.send(tree);

  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.image;
  uploadPath = __dirname + "/uploads/" + sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    res.send({ message: "File uploaded!" });
  });
});

app.listen(PORT, (err) => {
  if (!err) {
    console.log(`Server started at PORT: ${PORT}`);
  }
});
