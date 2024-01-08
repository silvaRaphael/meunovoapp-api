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
	updatePasswordSchema,
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
import { validEmailSchema } from "../../../application/adapters/email";
import { DeleteFileUseCase } from "../../../application/use-cases/file-use-case/delete-file-use-case";
import {
	ResetPasswordMessageTemplate,
	resetPasswordMessageTemplate,
} from "../../templates/reset-password-template";
import { genPasswordKey } from "../utils/gen-password-key";
import { GetUserByPasswordKeyUseCase } from "../../../application/use-cases/user-use-case/get-user-by-password-key-use-case";
import { UserNotFoundError } from "../../../application/errors";
import { EmailAlreadyInUseError } from "../../../application/errors/email-alread-in-use";
import { EmailNotAvailableError } from "../../../application/errors/email-not-available";
import { InvalidResetPasswordKeyError } from "../../../application/errors/reset-password-key-invalid";
import { CompleteProfileError } from "../../../application/errors/complete-profile";
import { getLang, handleLanguage } from "../utils/handle-language";
import { addHours } from "date-fns";

export class UserController {
	constructor(
		private createUserUseCase: CreateUserUseCase,
		private updateUserUseCase: UpdateUserUseCase,
		private signInUseCase: SignInUseCase,
		private getAllUsersUseCase: GetAllUsersUseCase,
		private getUserUseCase: GetUserUseCase,
		private getUserByEmailUseCase: GetUserByEmailUseCase,
		private getUserByPasswordKeyUseCase: GetUserByPasswordKeyUseCase,
		private uploadFileUseCase: UploadFileUseCase,
		private deleteFileUseCase: DeleteFileUseCase,

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

			res.status(200).send(response);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error, req) });
		}
	}

	async resetPassword(req: Request, res: Response) {
		try {
			const { email } = validEmailSchema.parse(req.body);

			const user = await this.getUserByEmailUseCase.execute(email);

			if (!user) throw new UserNotFoundError(req);

			if (!user.password) throw new CompleteProfileError(req);

			const passwordResetKey = genPasswordKey(user.password);

			if (!passwordResetKey) throw new CompleteProfileError(req);

			await this.sendEmailUseCase.execute({
				from: process.env.EMAIL_SENDER || "",
				to: [email],
				subject:
					"Solicitação de recuperação de senha de conta MeuNovoApp",
				html: replaceKeys<ResetPasswordMessageTemplate>(
					resetPasswordMessageTemplate,
					{
						"[resetPasswordKey]":
							encodeURIComponent(passwordResetKey),
						"[name]": user.name || "",
					},
				),
				type: "user-invite",
				no_save: true,
			});

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error, req) });
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
			res.status(401).send({ error: HandleError(error, req) });
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
				throw new EmailAlreadyInUseError(req);

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

			(req as AuthRequest).masterUserId?.forEach((user_id) => {
				this.createNotificationUseCase.execute({
					user_id,
					title: "Novo usuário",
					description: `Usuário "${name}" completou o cadastro!`,
					type: "done",
					link: `/usuarios/${id}`,
				});
			});

			res.cookie("auth", response.token, {
				httpOnly: true,
				expires: addHours(new Date(), 12),
				path: "/",
			})
				.status(200)
				.json({
					name: response.name,
					email: response.email,
					role: response.role,
					avatar: response.avatar,
				});
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error, req) });
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

			if (user && user.id !== id) throw new EmailNotAvailableError(req);

			if (old_password) {
				const user = await this.getUserUseCase.execute(id);

				if (!compareSync(old_password, user?.password || ""))
					throw new Error(
						handleLanguage(
							[
								["en", "Wrong old password."],
								["pt", "Senha antiga incorreta."],
							],
							getLang(req),
						),
					);
			}

			let avatarPath;

			if (avatar)
				avatarPath = this.uploadFileUseCase.execute({
					fileName: avatarName,
					base64: avatar,
				}).fileName;

			if (!avatar) avatarPath = avatarName;

			if (!avatarName)
				this.getUserUseCase.execute(id).then((response) => {
					if (response?.avatar)
						this.deleteFileUseCase.execute(response.avatar);
				});

			await this.updateUserUseCase.execute({
				id,
				name,
				email,
				avatar: avatarPath,
				password,
			});

			res.status(200).json({ avatar: avatarPath });
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error, req) });
		}
	}

	async updatePassword(req: Request, res: Response) {
		try {
			const { key } = req.params;
			const { password } = updatePasswordSchema.parse(req.body);

			const user = await this.getUserByPasswordKeyUseCase.execute(key);

			if (!user) throw new InvalidResetPasswordKeyError(req);

			if (!user.password) throw new CompleteProfileError(req);

			const passwordResetKey = genPasswordKey(user.password);

			if (!passwordResetKey) throw new CompleteProfileError(req);

			if (passwordResetKey !== key)
				throw new InvalidResetPasswordKeyError(req);

			await this.updateUserUseCase.execute({
				id: user.id,
				name: user.name || "",
				email: user.email,
				password,
			});

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error, req) });
		}
	}

	async getAllUsers(req: Request, res: Response) {
		try {
			const response = await this.getAllUsersUseCase.execute();

			res.status(200).json(response);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error, req) });
		}
	}

	async getUser(req: Request, res: Response) {
		try {
			const { id } = req.params;

			const user = await this.getUserUseCase.execute(id);

			(user as any).password = undefined;

			res.status(200).json(user);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error, req) });
		}
	}

	async getProfile(req: Request, res: Response) {
		try {
			const { userId: id } = req as AuthRequest;

			if (!id) throw new Error("ID é necessário");

			const user = await this.getUserUseCase.execute(id);

			(user as any).password = undefined;

			res.status(200).json(user);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error, req) });
		}
	}

	async canResetPassword(req: Request, res: Response) {
		try {
			const { key } = req.params;

			const user = await this.getUserByPasswordKeyUseCase.execute(key);

			if (!user) throw new InvalidResetPasswordKeyError(req);

			if (!user.password) throw new CompleteProfileError(req);

			const passwordResetKey = genPasswordKey(user.password);

			if (!passwordResetKey) throw new CompleteProfileError(req);

			if (passwordResetKey !== key)
				throw new InvalidResetPasswordKeyError(req);

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error, req) });
		}
	}

	async canUpdate(req: Request, res: Response) {
		try {
			const { id } = req.params;

			const user = await this.getUserUseCase.execute(id);

			if (!user) throw new UserNotFoundError(req);

			if (user?.password)
				throw new Error(
					handleLanguage(
						[
							["en", "Already registered user."],
							["pt", "Usuário já cadastrado."],
						],
						getLang(req),
					),
				);

			res.status(200).json({
				email: user.email,
			});
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error, req) });
		}
	}

	async canUseEmail(req: Request, res: Response) {
		try {
			const id = req.params.id || (req as AuthRequest).userId;
			const { email } = req.body;

			const user = await this.getUserByEmailUseCase.execute(email);

			if (user && user.id !== id) throw new EmailAlreadyInUseError(req);

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error, req) });
		}
	}
}
