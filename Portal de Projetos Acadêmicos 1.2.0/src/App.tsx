import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { FeaturedProjects } from "./components/FeaturedProjects";
import { Categories } from "./components/Categories";
import { PartnerInstitution } from "./components/PartnerInstitution";
import { Footer } from "./components/Footer";
import { CreateProject } from "./components/CreateProject";
import { EditProject } from "./components/EditProject";
import { Projects } from "./components/Projects";
import { ProjectDetails } from "./components/ProjectDetails";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { UserProfile } from "./components/UserProfile";
import { MyProjects } from "./components/MyProjects";
import { AdminDashboard } from "./components/AdminDashboard";
import { CreateAdmin } from "./components/CreateAdmin";
import { SearchResults } from "./components/SearchResults";
import { Contact } from "./components/Contact";
import { useState, useEffect } from "react";
import { initializeSampleProjects } from "./utils/projectsManager";

type Page =
  | "home"
  | "create-project"
  | "edit-project"
  | "projects"
  | "project-details"
  | "login"
  | "register"
  | "profile"
  | "my-projects"
  | "admin-dashboard"
  | "create-admin"
  | "search"
  | "contact";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedProjectId, setSelectedProjectId] = useState<
    number | null
  >(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState<string | undefined>(undefined);

  // Verifica se há uma sessão ativa ao carregar a página
  useEffect(() => {
    // Inicializar projetos demo sempre que não houver nenhum
    console.log("Inicializando projetos demo...");
    initializeSampleProjects();

    // Verifica se está logado
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);

    // Verifica se é admin
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
  }, []);

  const navigateToCreateProject = () => {
    // Verifica se o usuário está logado antes de permitir navegação
    if (!isLoggedIn) {
      alert("Você precisa fazer login para publicar um projeto.");
      setCurrentPage("login");
      return;
    }
    setCurrentPage("create-project");
  };

  const navigateToProjects = (course?: string) => {
    setCourseFilter(course);
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

  const navigateToAdminDashboard = () => {
    setCurrentPage("admin-dashboard");
  };

  const navigateToCreateAdmin = () => {
    setCurrentPage("create-admin");
  };

  const navigateToEditProject = (projectId: number) => {
    setSelectedProjectId(projectId);
    setCurrentPage("edit-project");
  };

  const navigateToContact = () => {
    setCurrentPage("contact");
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage("home");
  };

  const handleAdminLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsAdmin(true);
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
    localStorage.removeItem("currentUser");
    setCurrentPage("home");
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
        onNavigateToAdminDashboard={navigateToAdminDashboard}
        onNavigateToContact={navigateToContact}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
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
            <Footer onNavigateToContact={navigateToContact} />
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
            <Footer onNavigateToContact={navigateToContact} />
          </>
        )}

        {currentPage === "admin-dashboard" && (
          <>
            <AdminDashboard
              onBack={navigateToHome}
              onLogout={handleLogout}
              onNavigateToCreateAdmin={navigateToCreateAdmin}
            />
            <Footer onNavigateToContact={navigateToContact} />
          </>
        )}

        {currentPage === "create-admin" && (
          <>
            <CreateAdmin onBack={navigateToAdminDashboard} />
            <Footer onNavigateToContact={navigateToContact} />
          </>
        )}

        {currentPage === "create-project" && (
          <>
            <CreateProject onBack={navigateToHome} />
            <Footer onNavigateToContact={navigateToContact} />
          </>
        )}

        {currentPage === "edit-project" && (
          <>
            <EditProject 
              onBack={navigateToMyProjects} 
              projectId={selectedProjectId || 1}
            />
            <Footer onNavigateToContact={navigateToContact} />
          </>
        )}

        {currentPage === "projects" && (
          <>
            <Projects
              onBack={navigateToHome}
              onNavigateToProjectDetails={
                navigateToProjectDetails
              }
              isAdmin={isAdmin}
              initialCourseFilter={courseFilter}
            />
            <Footer onNavigateToContact={navigateToContact} />
          </>
        )}

        {currentPage === "project-details" && (
          <>
            <ProjectDetails
              onBack={navigateToProjects}
              projectId={selectedProjectId || 1}
              isAdmin={isAdmin}
            />
            <Footer onNavigateToContact={navigateToContact} />
          </>
        )}

        {currentPage === "profile" && (
          <>
            <UserProfile onBack={navigateToHome} />
            <Footer onNavigateToContact={navigateToContact} />
          </>
        )}

        {currentPage === "my-projects" && (
          <>
            <MyProjects
              onBack={navigateToHome}
              onNavigateToProjectDetails={
                navigateToProjectDetails
              }
              onNavigateToEditProject={navigateToEditProject}
              onNavigateToCreateProject={navigateToCreateProject}
              isAdmin={isAdmin}
            />
            <Footer onNavigateToContact={navigateToContact} />
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
              isAdmin={isAdmin}
            />
            <Footer onNavigateToContact={navigateToContact} />
          </>
        )}

        {currentPage === "contact" && (
          <>
            <Contact onBack={navigateToHome} />
            <Footer onNavigateToContact={navigateToContact} />
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
                isLoggedIn={isLoggedIn}
                onNavigateToLogin={navigateToLogin}
              />
              <FeaturedProjects
                onNavigateToProjects={navigateToProjects}
                onNavigateToProjectDetails={
                  navigateToProjectDetails
                }
                isAdmin={isAdmin}
              />
              <Categories
                onNavigateToProjects={navigateToProjects}
              />
              <PartnerInstitution />
            </main>
            <Footer onNavigateToContact={navigateToContact} />
          </>
        )}
      </div>
    </div>
  );
}