import express from 'express'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import donationRoutes from './routes/donationRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import dotenv from 'dotenv'

dotenv.config();

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/donations', donationRoutes)
app.use('/api/dashboard', dashboardRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
