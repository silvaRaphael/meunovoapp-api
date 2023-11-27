import { SendEmailSchema } from "../../src/application/adapters/email";
import { EmailRepository } from "../../src/application/repositories/email-repository";
import { GetAllEmailsUseCase } from "../../src/application/use-cases/email-use-case/get-all-emails-use-case";
import { GetEmailUseCase } from "../../src/application/use-cases/email-use-case/get-email-use-case";
import { ReplyEmailUseCase } from "../../src/application/use-cases/email-use-case/reply-email-use-case";
import { SendEmailUseCase } from "../../src/application/use-cases/email-use-case/send-email-use-case";
import { prisma } from "../../src/infra/database/prisma";
import { EmailRepositoryImpl } from "../../src/infra/database/repositories/email-repository-impl";
import { mailSender } from "../../src/infra/providers/nodemailer";

describe("Email tests", () => {
	let emailRepository: EmailRepository;

	let sendEmailUseCase: SendEmailUseCase;
	let replyEmailUseCase: ReplyEmailUseCase;
	let getAllEmailsUseCase: GetAllEmailsUseCase;
	let getEmailUseCase: GetEmailUseCase;

	let emailToSend: SendEmailSchema = {
		name: "Raphael",
		from: process.env.EMAIL_SENDER || "",
		to: [process.env.EMAIL_RECEIVER || ""],
		subject: "Test Subject",
		html: "<b>Email</b>",
	};

	beforeAll(() => {
		emailRepository = new EmailRepositoryImpl(prisma, mailSender);

		sendEmailUseCase = new SendEmailUseCase(emailRepository);
		replyEmailUseCase = new ReplyEmailUseCase(emailRepository);
		getAllEmailsUseCase = new GetAllEmailsUseCase(emailRepository);
		getEmailUseCase = new GetEmailUseCase(emailRepository);
	});

	it("should send email", async () => {
		expect(await sendEmailUseCase.execute(emailToSend)).toBeUndefined();
	});

	it("should reply email by id", async () => {
		expect(
			await replyEmailUseCase.execute({
				...emailToSend,
				replyed: "41660587-f260-478c-b82d-7c56acf75b41",
			}),
		).toBeUndefined();
	});

	it("should get all emails", async () => {
		const response = await getAllEmailsUseCase.execute({
			to: emailToSend.from,
			from: [emailToSend.from],
		});

		expect(response.length).toBeGreaterThan(0);
	});

	it("should get one email by id", async () => {
		const response = await getEmailUseCase.execute(
			"9e22487b-b6b3-4f4a-b984-79c3b1127f29",
		);

		expect(response).toBeDefined();
	});
});
