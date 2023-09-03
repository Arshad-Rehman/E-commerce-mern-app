import  express  from "express";
import dotenv from 'dotenv';
import morgan from "morgan";
import connectDb from "./congif/db.js";
import authRoutes from './routes/authRoutes.js'
import categoryRoute from './routes/categoryRoute.js';
import productRoutes from './routes/productRoutes.js';
import cors from 'cors'
import path from 'path'
dotenv.config();
const app = express();

connectDb();
//middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'./client/build')))
app.use('*',function(req,res){
    return res.sendFile(path.join(__dirname,'./client/build/index.html'));
})
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/category',categoryRoute);
app.use('/api/v1/products', productRoutes);

app.get('/',(req,resp)=>{
resp.send({
    message:"welcome"
})
});
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
});