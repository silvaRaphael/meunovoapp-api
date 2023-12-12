import { PrismaClient } from "@prisma/client";
import { User } from "../../domain/user";
import { Client } from "../../domain/client";

const prisma = new PrismaClient();

async function seed() {
	const exists = await prisma.user.findMany({
		select: {
			id: true,
		},
		where: {
			email: {
				in: ["raphaeltiago02@gmail.com", "contato@meunovoapp.com.br"],
			},
		},
	});

	if (exists.length) return;

	await prisma.client.createMany({
		data: [
			new Client({
				id: "adeb4944-9f1b-43dc-89e6-be1d0d00598d",
				company: "MeuNovoApp",
			}),
		],
	});

	await prisma.user.createMany({
		data: [
			new User(
				{
					id: "6e161850-e0bf-4a13-8417-212dd796be2a",
					name: "Raphael Silva",
					email: "raphaeltiago02@gmail.com",
					password:
						"$2a$08$xgjWis2LW/.aJ.gnlhMy3O.frk9kV0E.F1Og/332rklD5vpBTL7Zq",
					role: "master",
				},
				false,
			),
			new User(
				{
					name: "Raphael - ADM",
					email: "contato@meunovoapp.com.br",
					password:
						"$2a$08$xgjWis2LW/.aJ.gnlhMy3O.frk9kV0E.F1Og/332rklD5vpBTL7Zq",
					role: "client",
					is_manager: true,
					client_id: "adeb4944-9f1b-43dc-89e6-be1d0d00598d",
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
