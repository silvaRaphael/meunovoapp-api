import { Request, Response } from "express";
import { compareSync } from "bcrypt";
import { HandleError } from "../utils/handle-error";
import { CreateUserUseCase } from "../../../application/use-cases/user-use-case/create-user-use-case";
import { UpdateUserUseCase } from "../../../application/use-cases/user-use-case/update-user-use-case";
import { GetAllUsersUseCase } from "../../../application/use-cases/user-use-case/get-all-users-use-case";
import { GetUserUseCase } from "../../../application/use-cases/user-use-case/get-user-use-case";
import {
	createUserSchema,
	completeUserSchema,
	updateUserSchema,
} from "../../../application/adapters/user";
import { SignInUseCase } from "../../../application/use-cases/auth-use-case/sign-in-use-case";
import { GetUserByEmailUseCase } from "../../../application/use-cases/user-use-case/get-user-by-email-use-case";
import { AuthRequest } from "../../config/auth-request";
import { UploadFileUseCase } from "../../../application/use-cases/file-use-case/upload-file-use-case";
import { SendEmailUseCase } from "../../../application/use-cases/email-use-case/send-email-use-case";
import {
	InviteUserMessageTemplate,
	inviteUserMessageTemplate,
} from "../../templates/invite-user-message-template";
import { replaceKeys } from "../utils/replace-keys";
import { CreateNotificationUseCase } from "../../../application/use-cases/notification-use-case/create-notification-use-case";
import {
	sendEmailSchema,
	validEmailSchema,
} from "../../../application/adapters/email";

export class UserController {
	constructor(
		private createUserUseCase: CreateUserUseCase,
		private updateUserUseCase: UpdateUserUseCase,
		private signInUseCase: SignInUseCase,
		private getAllUsersUseCase: GetAllUsersUseCase,
		private getUserUseCase: GetUserUseCase,
		private getUserByEmailUseCase: GetUserByEmailUseCase,
		private uploadFileUseCase: UploadFileUseCase,

		private createNotificationUseCase: CreateNotificationUseCase,
		private sendEmailUseCase: SendEmailUseCase,
	) {}

	async createUser(req: Request, res: Response) {
		try {
			const { email, client_id, is_manager } = createUserSchema.parse(
				req.body,
			);

			const response = await this.createUserUseCase.execute({
				email,
				client_id,
				is_manager,
			});

			this.sendEmailUseCase.execute({
				from: process.env.EMAIL_SENDER || "",
				to: [email],
				subject: "Você recebeu um convite para se juntar à MeuNovoApp",
				html: replaceKeys<InviteUserMessageTemplate>(
					inviteUserMessageTemplate,
					{
						"[userId]": response.id,
					},
				),
				type: "user-invite",
				no_save: true,
			});

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async inviteUser(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { email } = validEmailSchema.parse(req.body);

			await this.sendEmailUseCase.execute({
				from: process.env.EMAIL_SENDER || "",
				to: [email],
				subject: "Você recebeu um convite para se juntar à MeuNovoApp",
				html: replaceKeys<InviteUserMessageTemplate>(
					inviteUserMessageTemplate,
					{
						"[userId]": id,
					},
				),
				type: "user-invite",
				no_save: true,
			});

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async completeUser(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { name, email, avatar, password } = completeUserSchema.parse(
				req.body,
			);

			const userEmail = await this.getUserByEmailUseCase.execute(email);

			if (userEmail && userEmail.id !== id)
				throw new Error("E-mail já em uso.");

			let avatarPath;

			if (avatar)
				avatarPath = this.uploadFileUseCase.execute({
					base64: avatar,
				}).fileName;

			await this.updateUserUseCase.execute({
				id,
				name,
				email,
				avatar: avatarPath,
				password,
				activated_at: new Date(),
			});

			const response = await this.signInUseCase.execute({
				email,
				password,
			});

			this.createNotificationUseCase.execute({
				user_id: "6e161850-e0bf-4a13-8417-212dd796be2a",
				title: "Novo usuário",
				description: `Usuário "${name}" completou seu cadastro!`,
				type: "done",
				link: `/usuarios/${id}`,
			});

			res.status(200).json(response);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async updateUser(req: Request, res: Response) {
		try {
			const { userId } = req as AuthRequest;
			const { id: paramId } = req.params;
			const id = paramId ?? userId;

			const { name, email, avatarName, avatar, old_password, password } =
				updateUserSchema.parse(req.body);

			const user = await this.getUserByEmailUseCase.execute(email);

			if (user && user.id !== id)
				throw new Error("E-mail não disponível.");

			if (old_password) {
				const user = await this.getUserUseCase.execute(id);

				if (!compareSync(old_password, user?.password || ""))
					throw new Error("Senha antiga incorreta.");
			}

			let avatarPath;

			if (avatar)
				avatarPath = this.uploadFileUseCase.execute({
					fileName: avatarName,
					base64: avatar,
				}).fileName;

			if (!avatar) avatarPath = avatarName;

			await this.updateUserUseCase.execute({
				id,
				name,
				email,
				avatar: avatarPath,
				password,
			});

			res.status(200).json({ avatar: avatarPath });
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async getAllUsers(req: Request, res: Response) {
		try {
			const response = await this.getAllUsersUseCase.execute();

			res.status(200).json(response);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async getUser(req: Request, res: Response) {
		try {
			const { id } = req.params;

			const response = await this.getUserUseCase.execute(id);

			res.status(200).json(response);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async getProfile(req: Request, res: Response) {
		try {
			const { userId: id } = req as AuthRequest;

			if (!id) throw new Error("ID é necessário");

			const response = await this.getUserUseCase.execute(id);

			res.status(200).json(response);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async canUpdate(req: Request, res: Response) {
		try {
			const { id } = req.params;

			const response = await this.getUserUseCase.execute(id);

			if (!response) throw new Error("Usuário não existe.");

			if (response?.password) throw new Error("Usuário já cadastrado.");

			res.status(200).json({
				email: response.email,
			});
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async canUseEmail(req: Request, res: Response) {
		try {
			const id = req.params.id || (req as AuthRequest).userId;
			const { email } = req.body;

			const response = await this.getUserByEmailUseCase.execute(email);

			if (response && response.id !== id)
				throw new Error("E-mail já em uso.");

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}
}
