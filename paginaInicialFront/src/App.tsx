import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { FeaturedProjects } from "./components/FeaturedProjects";
import { Categories } from "./components/Categories";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <FeaturedProjects />
        <Categories />
      </main>
      <Footer />
    </div>
  );
}