import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { FeaturedProjects } from "./components/FeaturedProjects";
import { Categories } from "./components/Categories";
import { PartnerInstitution } from "./components/PartnerInstitution";
import { Footer } from "./components/Footer";
import { CreateProject } from "./components/CreateProject";
import { Projects } from "./components/Projects";
import { ProjectDetails } from "./components/ProjectDetails";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { UserProfile } from "./components/UserProfile";
import { MyProjects } from "./components/MyProjects";
import { AdminDashboard } from "./components/AdminDashboard";
import { SearchResults } from "./components/SearchResults";
import { useState, useEffect } from "react";

type Page =
  | "home"
  | "create-project"
  | "projects"
  | "project-details"
  | "login"
  | "register"
  | "profile"
  | "my-projects"
  | "admin-dashboard"
  | "search";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedProjectId, setSelectedProjectId] = useState<
    number | null
  >(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Verifica se há uma sessão ativa ao carregar a página
  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    const loggedStatus = localStorage.getItem("isLoggedIn") === "true";

    setIsAdmin(adminStatus);
    setIsLoggedIn(loggedStatus);
  }, []);

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

  const navigateToSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage("search");
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    setCurrentPage("home");
  };

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    setIsLoggedIn(true);
    localStorage.setItem("isAdmin", "true");
    localStorage.setItem("isLoggedIn", "true");
    setCurrentPage("admin-dashboard");
  };

  const handleRegisterSuccess = () => {
    setCurrentPage("login");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("projeplac_current_author");
    localStorage.removeItem("projeplac_current_user_email");
    localStorage.removeItem("projeplac_current_user_type");
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
        onNavigateToSearch={navigateToSearch}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      {/* Conteúdo principal com padding-top para compensar header fixo */}
      <div className="pt-16 flex-1">
        {currentPage === "register" && (
          <>
            <Register
              onBack={navigateToLogin}
              onRegisterSuccess={handleRegisterSuccess}
            />
            <Footer />
          </>
        )}

        {currentPage === "login" && (
          <>
            <Login
              onBack={navigateToHome}
              onLoginSuccess={handleLoginSuccess}
              onNavigateToRegister={navigateToRegister}
              onAdminLoginSuccess={handleAdminLoginSuccess}
            />
            <Footer />
          </>
        )}

        {currentPage === "admin-dashboard" && (
          <AdminDashboard
            onBack={navigateToHome}
            onLogout={handleLogout}
          />
        )}

        {currentPage === "create-project" && (
          <>
            <CreateProject onBack={navigateToHome} />
            <Footer />
          </>
        )}

        {currentPage === "projects" && (
          <>
            <Projects
              onBack={navigateToHome}
              onNavigateToProjectDetails={
                navigateToProjectDetails
              }
            />
            <Footer />
          </>
        )}

        {currentPage === "project-details" && (
          <>
            <ProjectDetails
              onBack={navigateToProjects}
              projectId={selectedProjectId || 1}
            />
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
            <MyProjects
              onBack={navigateToHome}
              onNavigateToProjectDetails={
                navigateToProjectDetails
              }
            />
            <Footer />
          </>
        )}

        {currentPage === "search" && (
          <>
            <SearchResults
              onBack={navigateToHome}
              onNavigateToProjectDetails={
                navigateToProjectDetails
              }
              initialSearchTerm={searchTerm}
            />
            <Footer />
          </>
        )}

        {currentPage === "home" && (
          <>
            <main className="flex-1">
              <Hero
                onNavigateToCreateProject={
                  navigateToCreateProject
                }
                onNavigateToProjects={navigateToProjects}
              />
              <FeaturedProjects
                onNavigateToProjects={navigateToProjects}
                onNavigateToProjectDetails={
                  navigateToProjectDetails
                }
              />
              <Categories
                onNavigateToProjects={navigateToProjects}
              />
              <PartnerInstitution />
            </main>
            <Footer />
          </>
        )}
      </div>
    </div>
  );
}
