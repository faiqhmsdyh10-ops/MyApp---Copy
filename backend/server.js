import express from 'express'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import donationRoutes from './routes/donationRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import transparansiRoutes from './routes/transparansiRoutes.js'
import dotenv from 'dotenv'

dotenv.config();

const app = express()

app.use(cors())
app.use(express.json({ limit: '50mb' })) // Increase limit for base64 images
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use('/api/users', userRoutes)
app.use('/api/donations', donationRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/transparansi', transparansiRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
