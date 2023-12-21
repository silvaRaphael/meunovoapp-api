import { PrismaClient } from "@prisma/client";
import { User } from "../../domain/user";

const prisma = new PrismaClient();

async function seed() {
	const exists = await prisma.user.findMany({
		select: {
			id: true,
		},
		where: {
			email: {
				in: ["contato@meunovoapp.com.br"],
			},
		},
	});

	if (exists.length) return;

	await prisma.user.createMany({
		data: [
			new User(
				{
					id: "6e161850-e0bf-4a13-8417-212dd796be2a",
					name: "Raphael Silva - MeuNovoApp",
					email: "contato@meunovoapp.com.br",
					password:
						"$2a$08$xgjWis2LW/.aJ.gnlhMy3O.frk9kV0E.F1Og/332rklD5vpBTL7Zq",
					role: "master",
				},
				false,
			),
		],
	});
}

seed()
	.catch((e) => {
		console.error(e);
		throw e;
	})
	.finally(async () => {
		await prisma.$disconnect();
		console.log("DB seeded!");
	});
