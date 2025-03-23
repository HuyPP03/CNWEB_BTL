import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRoutes from "./routers/routers";

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;
