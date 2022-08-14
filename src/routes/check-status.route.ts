import { Router } from "express";
import { StatusServerController } from "../controllers/StatusServerController";

const checkStatusRoute = Router();

checkStatusRoute.get('/status', new StatusServerController().checkStatusServer);

export default checkStatusRoute;