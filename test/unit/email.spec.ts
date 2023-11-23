import { EmailSchema } from "../../src/application/adapters/email";
import { EmailRepository } from "../../src/application/repositories/email-repository";
import { GetAllEmailsUseCase } from "../../src/application/use-cases/email-use-case/get-all-emails-use-case";
import { GetEmailUseCase } from "../../src/application/use-cases/email-use-case/get-email-use-case";
import { SendEmailUseCase } from "../../src/application/use-cases/email-use-case/send-email-use-case";
import { prisma } from "../../src/infra/database/prisma";
import { EmailRepositoryImpl } from "../../src/infra/database/repositories/email-repository-impl";
import { resend } from "../../src/infra/providers/resend";

describe("Email tests", () => {
	let emailRepository: EmailRepository;

	let sendEmailUseCase: SendEmailUseCase;
	let getAllEmailsUseCase: GetAllEmailsUseCase;
	let getEmailUseCase: GetEmailUseCase;

	let emailToSend: EmailSchema = {
		name: "Raphael",
		from: process.env.EMAIL_SENDER || "",
		to: [process.env.EMAIL_RECEIVER || ""],
		subject: "Test Subject",
		html: "<b>Email</b>",
	};

	beforeAll(() => {
		emailRepository = new EmailRepositoryImpl(prisma, resend);

		getAllEmailsUseCase = new GetAllEmailsUseCase(emailRepository);
		getEmailUseCase = new GetEmailUseCase(emailRepository);
	});

	it("should send email", async () => {
		expect(await sendEmailUseCase.execute(emailToSend)).toBeUndefined();
	});

	// it("should get all emails", async () => {
	// 	const response = await getAllEmailsUseCase.execute();

	// 	expect(response).toHaveLength(1);
	// });

	// it("should get one email by id", async () => {
	// 	const response = await getEmailUseCase.execute(
	// 		"3aeca3f9-584f-458c-8af5-a100f0ab6485",
	// 	);

	// 	expect(response).toBeDefined();
	// });
});
