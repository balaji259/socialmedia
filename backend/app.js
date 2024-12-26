const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const connectDB = require('./db/db');
const authRouter = require('./routes/auth');
const postRouter=require("./routes/postRoutes");
const userRouter=require("./routes/user")
const profileRouter=require("./routes/profile");
const streakRouter=require('./routes/streak');
const chatRouter=require("./routes/message");
// const otpRoutes = require('./routes/otpRoutes')

const {app,server} =require("./socket.js");

const cors = require('cors');



// const upload = require('./routes/upload'); // Import upload middleware
require('dotenv').config();

// const app = express();

app.use(express.json({ limit: '50mb' })); // Set limit to 10 MB
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '..','frontend','dist')));

// app.use(cors({
//   origin: 'http://localhost:8000', // Replace with your frontend URL
//   credentials: true, // Allow cookies to be sent
// }));
// Connect to MongoDB

app.use(cors());

connectDB();

// Routes
app.use('/user', authRouter);
app.use('/posts',postRouter);
app.use('/user',userRouter);
app.use('/profile',profileRouter);
app.use('/streak',streakRouter);
app.use('/messages',chatRouter);
// app.use('/chat',chatRouter);
// app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));


// Media Upload Route

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something went wrong!');
// });

// app.get('*',(req,res)=>{
//   res.sendFile(path.join(__dirname,'..','frontend','dist','index.html'));
// })
// Start the server
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
