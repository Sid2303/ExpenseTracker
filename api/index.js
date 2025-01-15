import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import TransactionModel from './models/Transaction.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/test',(req,res)=>{
    res.json({msg:"Hello"})
})

app.post('/api/transaction',async (req,res)=>{
    await mongoose.connect(process.env.MONGO_URL)
    const {name,price,description,dateTime} = req.body;
    const transaction = await TransactionModel.create({name,price,description,dateTime})
    res.json(transaction)
    
})

app.get('/api/transactions',async (req,res)=>{
    await mongoose.connect(process.env.MONGO_URL)
    const transactions = await TransactionModel.find();
    res.json(transactions)
})

app.get('/api/money',async(req,res)=>{
    mongoose.connect(process.env.MONGO_URL)
    const money =await TransactionModel.find()
    res.json(money)
})

app.listen(4000)