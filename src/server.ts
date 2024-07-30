// src/server.ts
// Configurations de Middlewares
import express from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { setupSwagger } from './swagger';
import morgan from 'morgan';
import { ONE_HUNDRED, SIXTY } from './core/constants';
import { userRoute } from './routes/user.routes';
import { bookRoute } from './routes/book.routes';
import { borrowRoute } from './routes/borrow.routes';
import { routeReserved } from './routes/reservation.routes';
import { routeNotif } from './routes/notification.routes';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(
	rateLimit({
		max: ONE_HUNDRED,
		windowMs: SIXTY,
		message: 'Trop de Requete à partir de cette adresse IP '
	})
);
app.use(morgan('combined'));
app.use(cookieParser())
app.use('/users',userRoute)
app.use('/books',bookRoute)
app.use('/loans',borrowRoute)
app.use('/reservations',routeReserved)
app.use('/notification',routeNotif)

setupSwagger(app);
export default app;
