const express = require('express');

const cors = require('cors');

const morgan = require('morgan');

const dotenv = require('dotenv');

dotenv.config({path:'config.env'});

const dbConnection = require('./config/database');

const ApiError =require('./utils/apiError');

const authRoute = require('./routes/authRoute');

const globalError = require('./middlewares/errorMiddleware');

dbConnection();

const app = express();

 // Enable other domains to access your application
 app.use(cors());
 app.options('*', cors());

app.use(express.json());


if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
    console.log(`${process.env.NODE_ENV} mode`);
}

//Routes
app.get('/',(req, res) =>{
  res.json({message : 'welcome to render'});
});
app.use('/api/v1/auth',authRoute);


//  error handling middleware for routes
app.all('*',(req,res,next)=>{
    next(new ApiError(`can't find this route : ${req.originalUrl}`,400));
});


// Global error handling middleware for express 
app.use(globalError);

    
const port = process.env.PORT || 8000 ;

const server = app.listen(port,()=>{
        console.log(`running on port ${port}`);
    });
    

 // handle rejection outside express (database connection)
 process.on('unhandledRejection',(err)=>{
    console.log(`Database Error: ${err.name} | ${err.message}`);
    server.close(()=>{
      console.log(`shutting down...`);
      process.exit(1);
    });
  });