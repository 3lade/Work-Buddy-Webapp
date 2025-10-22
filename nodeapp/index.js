require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRouter = require('./routers/userRouter')
const leaveRouter=require('./routers/leaveRequestRouter');
const wfhRouter=require('./routers/wfhRequestRouter');

const app = express();

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

app.use(cors({
    origin: process.env.ORIGIN_URL,
    credentials: true
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB connected successfully');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Routes
app.use('/api/user', userRouter);
app.use('/api/leave',leaveRouter);
app.use('/api/wfh-requests',wfhRouter)


// Start server with port 8080
app.listen(process.env.PORT1, () => {
    console.log('Server is running on port 8080');
});

module.exports = app;