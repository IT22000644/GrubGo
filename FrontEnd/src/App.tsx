import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      <Header /> {/* Include Header on all pages */}
      <main className="flex-grow">
        <AppRoutes />
      </main>
      <Footer /> {/* Include Footer on all pages */}
    </div>
  );
};

export default App;
