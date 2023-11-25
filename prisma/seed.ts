import { PrismaClient } from "@prisma/client";
import { User } from "../src/domain/user";

const prisma = new PrismaClient();

async function seed() {
	const exists = await prisma.user.findUnique({
		where: { email: "raphaeltiago02@gmail.com" },
	});

	if (exists) return;

	await prisma.user.createMany({
		data: [
			new User({
				name: "Raphael Silva",
				email: "raphaeltiago02@gmail.com",
				password:
					"$2a$08$xgjWis2LW/.aJ.gnlhMy3O.frk9kV0E.F1Og/332rklD5vpBTL7Zq",
				role: "master",
			}),
		],
	});
}

seed()
	.catch((e) => {
		throw e;
	})
	.finally(async () => {
		await prisma.$disconnect();
		console.log("DB seeded!");
	});
