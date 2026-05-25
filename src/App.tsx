import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Flex } from "@radix-ui/themes";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ArticlesPage from "./pages/ArticlesPage";
import AboutPage from "./pages/AboutPage";
import MyDataPage from "./pages/MyDataPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import PracticePage from "./pages/PracticePage";
import CoursesPage from "./pages/CoursesPage";
import SimulationsPage from "./pages/SimulationsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Flex direction="column" style={{ minHeight: "100vh" }}>
        <Navbar />
        <Flex direction="column" flexGrow="1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/my-data" element={<MyDataPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/simulations" element={<SimulationsPage />} />
          </Routes>
        </Flex>
        <Footer />
      </Flex>
    </BrowserRouter>
  );
}
