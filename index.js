// Import 
const express = require("express"); // Import express library
const cors = require("cors"); // Import cors
const mainRouter = require("./src/router/index"); // Import main router
const app = express();
const commonResponse = require("./src/common/response") // Import Template Response


// Use middleware
app.use(express.json());
app.use(cors({
  origin: ['*'],
     methods: ["GET","PUT","POST","DELETE"]
}));

// Port choice
const port = process.env.PORT || 4000;

// use Main Router
app.use("/", mainRouter);
app.use(( _req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

app.all("*", (_req, res, next) => {
    next(commonResponse.response(res, null, 404, "URL not Found"));
});

//Error code and message
app.use((err, _req, res) => {
    if (err && err.message === "File too large"){
        return commonResponse.response(res, null, 413, "Image size too large (Max 2MB)")
    }
    console.log(err)
    return commonResponse.response(res, null, 500, "err")
})

// Listening port awaiting requests
app.listen(port, () => {
    console.log(`Server run on port: ${port}`);
});
