import { ClientRepository } from "../../src/application/repositories/client-repository";
import { CreateClientUseCase } from "../../src/application/use-cases/client-use-case/create-client-use-case";
import { GetAllClientsUseCase } from "../../src/application/use-cases/client-use-case/get-all-clients-use-case";
import { GetClientUseCase } from "../../src/application/use-cases/client-use-case/get-client-use-case";
import { UpdateClientUseCase } from "../../src/application/use-cases/client-use-case/update-client-use-case";
import { prisma } from "../../src/infra/database/prisma";
import { ClientRepositoryImpl } from "../../src/infra/database/repositories/client-repository-impl";

describe("Client tests", () => {
	let clientRepository: ClientRepository;

	let createClientUseCase: CreateClientUseCase;
	let updateClientUseCase: UpdateClientUseCase;
	let getAllClientsUseCase: GetAllClientsUseCase;
	let getClientUseCase: GetClientUseCase;

	beforeAll(() => {
		clientRepository = new ClientRepositoryImpl(prisma);

		createClientUseCase = new CreateClientUseCase(clientRepository);
		updateClientUseCase = new UpdateClientUseCase(clientRepository);
		getAllClientsUseCase = new GetAllClientsUseCase(clientRepository);
		getClientUseCase = new GetClientUseCase(clientRepository);
	});

	it("should create a client", async () => {
		const response = await createClientUseCase.execute({
			company: "test",
		});

		expect(response).toBeUndefined();
	});

	it("should get all clients", async () => {
		const response = await getAllClientsUseCase.execute();

		console.log(response);

		expect(response.length).toBeGreaterThan(0);
	});

	it("should get one client by id", async () => {
		const response = await getClientUseCase.execute(
			"42d21a6e-5694-4f91-ba4b-9c8a08e09281",
		);

		expect(response?.company).toBe("test edited");
	});

	it("should update client by id", async () => {
		const response = await updateClientUseCase.execute({
			id: "42d21a6e-5694-4f91-ba4b-9c8a08e09281",
			company: "test edited",
		});

		expect(response).toBeUndefined();
	});
});
