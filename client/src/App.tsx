import AppRoutes from './routers/routers';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';
import SimpleFooter from './components/SimpleFooter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="app">
      <AuthProvider>
        <Header />
        <main>
          <AppRoutes />
        </main>
        <SimpleFooter />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </AuthProvider>
    </div>
  );
}

export default App;
