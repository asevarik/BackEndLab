import { Request, Response, Router } from "express";
import { sanatizeUserModelMiddleware, sanatizeUserSignInModelMiddleware } from "../Middlewares/sanitizationMiddleware";
import { getAllUsersController, userLogoutController, userRegistrationController, userSignInController } from "../controllers/auth.controller";
import { authMiddleware, authorizeRole } from "../Middlewares/authMiddleware";
import { ROLES } from "../shared/utils/constants";

const authRoutes = Router();

authRoutes.post('/signin',sanatizeUserSignInModelMiddleware,userSignInController)

authRoutes.post('/signup',sanatizeUserModelMiddleware,userRegistrationController)

authRoutes.post('/signout',userLogoutController)

authRoutes.get('/users',authMiddleware,authorizeRole(ROLES.ADMIN,ROLES.SUPER_ADMIN),getAllUsersController)

authRoutes.get('/sse/admin/metrics',authMiddleware,authorizeRole(ROLES.SUPER_ADMIN),)

export default authRoutes;