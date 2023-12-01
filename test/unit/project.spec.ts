import { ProjectRepository } from "../../src/application/repositories/project-repository";
import { CreateProjectUseCase } from "../../src/application/use-cases/project-use-case/create-project-use-case";
import { GetAllProjectsUseCase } from "../../src/application/use-cases/project-use-case/get-all-projects-use-case";
import { GetProjectUseCase } from "../../src/application/use-cases/project-use-case/get-project-use-case";
import { UpdateProjectUseCase } from "../../src/application/use-cases/project-use-case/update-project-use-case";
import { prisma } from "../../src/infra/database/prisma";
import { ProjectRepositoryImpl } from "../../src/infra/database/repositories/project-repository-impl";

describe("Project tests", () => {
	let projectRepository: ProjectRepository;

	let createProjectUseCase: CreateProjectUseCase;
	let updateProjectUseCase: UpdateProjectUseCase;
	let getAllProjectsUseCase: GetAllProjectsUseCase;
	let getProjectUseCase: GetProjectUseCase;

	beforeAll(() => {
		projectRepository = new ProjectRepositoryImpl(prisma);

		createProjectUseCase = new CreateProjectUseCase(projectRepository);
		updateProjectUseCase = new UpdateProjectUseCase(projectRepository);
		getAllProjectsUseCase = new GetAllProjectsUseCase(projectRepository);
		getProjectUseCase = new GetProjectUseCase(projectRepository);
	});

	it("should create a project", async () => {
		const response = await createProjectUseCase.execute({
			client_id: "adeb4944-9f1b-43dc-89e6-be1d0d00598d",
			name: "project test",
			description: "test....",
			due: new Date(),
		});

		expect(response).toHaveLength(1);
	});

	it("should upadate a project by id", async () => {
		const response = await updateProjectUseCase.execute({
			id: "57f19ee2-7495-4365-af66-dd35a9ef6131",
			client_id: "adeb4944-9f1b-43dc-89e6-be1d0d00598d",
			name: "project test",
			description: "test....",
			due: new Date(),
			status: "in progress",
		});

		expect(response).toHaveLength(1);
	});

	it("should get all projects", async () => {
		const response = await getAllProjectsUseCase.execute();

		expect(response.length).toBeGreaterThan(0);
	});

	it("should get one project by id", async () => {
		const response = await getProjectUseCase.execute(
			"57f19ee2-7495-4365-af66-dd35a9ef6131",
		);

		expect(response?.name).toBe("project test");
	});
});
