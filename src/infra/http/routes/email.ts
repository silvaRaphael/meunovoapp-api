import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { EmailRepositoryImpl } from "../../database/repositories/email-repository-impl";
import { prisma } from "../../database/prisma";
import { mailSender } from "../../providers/nodemailer";
import { SendEmailUseCase } from "../../../application/use-cases/email-use-case/send-email-use-case";
import { GetAllEmailsUseCase } from "../../../application/use-cases/email-use-case/get-all-emails-use-case";
import { GetEmailUseCase } from "../../../application/use-cases/email-use-case/get-email-use-case";
import { EmailController } from "../controllers/email-controller";
import { ReplyEmailUseCase } from "../../../application/use-cases/email-use-case/reply-email-use-case";

const routes = Router();

const emailRepository = new EmailRepositoryImpl(prisma, mailSender);

const sendEmailUseCase = new SendEmailUseCase(emailRepository);
const replyEmailUseCase = new ReplyEmailUseCase(emailRepository);
const getAllEmailsUseCase = new GetAllEmailsUseCase(emailRepository);
const getEmailUseCase = new GetEmailUseCase(emailRepository);

const emailController = new EmailController(
	sendEmailUseCase,
	replyEmailUseCase,
	getAllEmailsUseCase,
	getEmailUseCase,
);

routes.post("/", (req, res) => {
	emailController.sendEmail(req, res);
});

routes.post("/:replyed", AuthMiddleware, (req, res) => {
	emailController.replyEmail(req, res);
});

routes.get("/", AuthMiddleware, (req, res) => {
	emailController.getAllEmails(req, res);
});

routes.get("/:id", AuthMiddleware, (req, res) => {
	emailController.getEmail(req, res);
});

export default routes;
