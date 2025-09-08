import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProjectsSection } from './components/ProjectsSection';
import { Dashboard } from './components/Dashboard';
import { Footer } from './components/Footer';
import { Login } from './components/Login';
import { NewProjectForm } from './components/NewProjectForm';
import { AuthProvider, useAuth } from './components/AuthContext';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProjects, setNewProjects] = useState<any[]>([]);

  const handleNewProject = () => {
    setShowNewProjectForm(true);
  };

  const handleProjectAdded = (project: any) => {
    setNewProjects(prev => [project, ...prev]);
  };

  const handleCancelNewProject = () => {
    setShowNewProjectForm(false);
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  if (showNewProjectForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewProjectForm 
            onProjectAdded={handleProjectAdded}
            onCancel={handleCancelNewProject}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onNewProject={handleNewProject} />
      <main>
        <Hero />
        <ProjectsSection newProjects={newProjects} />
        <Dashboard />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    // Load Font Awesome
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(link);

    // Load AOS CSS and JS
    const aosLink = document.createElement('link');
    aosLink.rel = 'stylesheet';
    aosLink.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
    document.head.appendChild(aosLink);

    const aosScript = document.createElement('script');
    aosScript.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
    aosScript.onload = () => {
      // Initialize AOS after script loads
      (window as any).AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50
      });
    };
    document.head.appendChild(aosScript);

    // Clean up function
    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.head.contains(aosLink)) document.head.removeChild(aosLink);
      if (document.head.contains(aosScript)) document.head.removeChild(aosScript);
    };
  }, []);

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}