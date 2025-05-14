import AppRoutes from './routers/routers';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';
import SimpleFooter from './components/SimpleFooter';

function App() {
  return (
    <div className="app">
      <AuthProvider>
        <Header />
        <main>
          <AppRoutes />
        </main>
        <SimpleFooter />
      </AuthProvider>
    </div>
  );
}

export default App;
