import nodemailer from "nodemailer";

export const mailSender = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: 465,
	secure: true,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

export type MailSender = typeof mailSender;
