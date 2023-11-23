import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { EmailRepositoryImpl } from "../../database/repositories/email-repository-impl";
import { prisma } from "../../database/prisma";
import { resend } from "../../providers/resend";
import { SendEmailUseCase } from "../../../application/use-cases/email-use-case/send-email-use-case";
import { GetAllEmailsUseCase } from "../../../application/use-cases/email-use-case/get-all-emails-use-case";
import { GetEmailUseCase } from "../../../application/use-cases/email-use-case/get-email-use-case";
import { EmailController } from "../controllers/email-controller";

const routes = Router();

const emailRepository = new EmailRepositoryImpl(prisma, resend);

const sendEmailUseCase = new SendEmailUseCase(emailRepository);
const getAllEmailsUseCase = new GetAllEmailsUseCase(emailRepository);
const getEmailUseCase = new GetEmailUseCase(emailRepository);

const emailController = new EmailController(
	sendEmailUseCase,
	getAllEmailsUseCase,
	getEmailUseCase,
);

routes.post("/send", (req, res) => {
	emailController.sendEmail(req, res);
});

routes.get("/", AuthMiddleware, (req, res) => {
	emailController.getAllEmails(req, res);
});

routes.get("/:id", AuthMiddleware, (req, res) => {
	emailController.getEmail(req, res);
});

export default routes;
