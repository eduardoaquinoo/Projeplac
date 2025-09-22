import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { FeaturedProjects } from "./components/FeaturedProjects";
import { Categories } from "./components/Categories";
import { Footer } from "./components/Footer";
import { CreateProject } from "./components/CreateProject";
import { Projects } from "./components/Projects";
import { ProjectDetails } from "./components/ProjectDetails";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { UserProfile } from "./components/UserProfile";
import { MyProjects } from "./components/MyProjects";
import { useState } from "react";

type Page = "home" | "create-project" | "projects" | "project-details" | "login" | "register" | "profile" | "my-projects";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigateToCreateProject = () => {
    setCurrentPage("create-project");
  };

  const navigateToProjects = () => {
    setCurrentPage("projects");
  };

  const navigateToProjectDetails = (projectId: number) => {
    setSelectedProjectId(projectId);
    setCurrentPage("project-details");
  };

  const navigateToHome = () => {
    setCurrentPage("home");
  };

  const navigateToLogin = () => {
    setCurrentPage("login");
  };

  const navigateToRegister = () => {
    setCurrentPage("register");
  };

  const navigateToProfile = () => {
    setCurrentPage("profile");
  };

  const navigateToMyProjects = () => {
    setCurrentPage("my-projects");
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage("home");
  };

  const handleRegisterSuccess = () => {
    setCurrentPage("login");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header fixo em todas as páginas */}
      <Header 
        onNavigateToCreateProject={navigateToCreateProject} 
        onNavigateToProjects={navigateToProjects}
        onNavigateToLogin={navigateToLogin}
        onNavigateToHome={navigateToHome}
        onNavigateToProfile={navigateToProfile}
        onNavigateToMyProjects={navigateToMyProjects}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      {/* Conteúdo principal com padding-top para compensar header fixo */}
      <div className="pt-16 flex-1">
        {currentPage === "register" && (
          <>
            <Register onBack={navigateToLogin} onRegisterSuccess={handleRegisterSuccess} />
            <Footer />
          </>
        )}

        {currentPage === "login" && (
          <>
            <Login 
              onBack={navigateToHome} 
              onLoginSuccess={handleLoginSuccess}
              onNavigateToRegister={navigateToRegister}
            />
            <Footer />
          </>
        )}

        {currentPage === "create-project" && (
          <>
            <CreateProject onBack={navigateToHome} />
            <Footer />
          </>
        )}

        {currentPage === "projects" && (
          <>
            <Projects onBack={navigateToHome} onNavigateToProjectDetails={navigateToProjectDetails} />
            <Footer />
          </>
        )}

        {currentPage === "project-details" && (
          <>
            <ProjectDetails onBack={navigateToProjects} projectId={selectedProjectId || 1} />
            <Footer />
          </>
        )}

        {currentPage === "profile" && (
          <>
            <UserProfile onBack={navigateToHome} />
            <Footer />
          </>
        )}

        {currentPage === "my-projects" && (
          <>
            <MyProjects onBack={navigateToHome} onNavigateToProjectDetails={navigateToProjectDetails} />
            <Footer />
          </>
        )}

        {currentPage === "home" && (
          <>
            <main className="flex-1">
              <Hero 
                onNavigateToCreateProject={navigateToCreateProject}
                onNavigateToProjects={navigateToProjects}
              />
              <FeaturedProjects 
                onNavigateToProjects={navigateToProjects} 
                onNavigateToProjectDetails={navigateToProjectDetails} 
              />
              <Categories onNavigateToProjects={navigateToProjects} />
            </main>
            <Footer />
          </>
        )}
      </div>
    </div>
  );
}