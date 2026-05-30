import React from "react";
import Home from "./pages/home/Home";
import { AuthProvider } from "./contexts/AuthContext";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";
import "./index.css";

function App() {
	return (
		<AuthProvider>
			<WorkspaceProvider>
				<Home />
			</WorkspaceProvider>
		</AuthProvider>
	);
}

export default App;


