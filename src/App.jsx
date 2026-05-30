import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./contexts/AuthContext";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";
import "./index.css";

function App() {
	return (
		<AuthProvider>
			<WorkspaceProvider>
				<AppRouter />
			</WorkspaceProvider>
		</AuthProvider>
	);
}

export default App;
