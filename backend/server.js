import express from 'express'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import donationRoutes from './routes/donationRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import transparansiRoutes from './routes/transparansiRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from the backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express()

app.use(cors())
app.use(express.json({ limit: '50mb' })) // Increase limit for base64 images
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use('/api/users', userRoutes)
app.use('/api/donations', donationRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/transparansi', transparansiRoutes)
app.use('/api/payment', paymentRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
