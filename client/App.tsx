import { Route } from "wouter";
import { Navbar } from "./components/Navbar";
import { routes } from "./routes";

export function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <main className="container mx-auto p-4">
        {routes.map(({ path, component: Component }) => (
          <Route key={path} path={path}>
            <Component />
          </Route>
        ))}
      </main>
    </div>
  );
}
