import { server } from "./server";
import "../websocket";

const PORT = process.env.PORT || 3333;

server.listen(PORT, () =>
	console.log(`Server is running on ${process.env.SITE_URI}`),
);

export { server };
