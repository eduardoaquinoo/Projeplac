import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowLeft, Mail, Phone, MapPin, Github, Twitter, Linkedin, Instagram, Facebook } from "lucide-react";
import { useState, useEffect } from "react";
import projeplacLogo from "figma:asset/b3251cf511c1d97994f8e9f326025eaf4de9bd06.png";

interface ContactProps {
  onBack: () => void;
}

interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  socialMedia: {
    github: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    facebook: string;
  };
}

const getDefaultContactInfo = (): ContactInfo => ({
  email: "eduardo.aquino@esoftware.uniceplac.edu.br",
  phone: "(61) 98282-9992",
  location: "Gama, DF - Brasil",
  socialMedia: {
    github: "#",
    twitter: "#",
    linkedin: "#",
    instagram: "#",
    facebook: "#"
  }
});

const getContactInfo = (): ContactInfo => {
  const stored = localStorage.getItem('contactInfo');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Erro ao carregar informações de contato:', e);
      return getDefaultContactInfo();
    }
  }
  return getDefaultContactInfo();
};

export function Contact({ onBack }: ContactProps) {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(getDefaultContactInfo());

  useEffect(() => {
    setContactInfo(getContactInfo());
  }, []);

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      url: contactInfo.socialMedia.github,
      color: "hover:bg-[#333] hover:text-white"
    },
    {
      icon: Twitter,
      label: "Twitter",
      url: contactInfo.socialMedia.twitter,
      color: "hover:bg-[#1DA1F2] hover:text-white"
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      url: contactInfo.socialMedia.linkedin,
      color: "hover:bg-[#0A66C2] hover:text-white"
    },
    {
      icon: Instagram,
      label: "Instagram",
      url: contactInfo.socialMedia.instagram,
      color: "hover:bg-[#E4405F] hover:text-white"
    },
    {
      icon: Facebook,
      label: "Facebook",
      url: contactInfo.socialMedia.facebook,
      color: "hover:bg-[#1877F2] hover:text-white"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header da página */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="flex items-center space-x-2 text-primary hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
              <div className="flex items-center space-x-3">
                <img 
                  src={projeplacLogo} 
                  alt="Projeplac Logo" 
                  className="h-10 w-auto"
                />
                <div>
                  <h1 className="text-2xl font-bold">
                    <span className="text-primary">Proje</span>
                    <span className="text-secondary">plac</span>
                  </h1>
                  <p className="text-sm text-muted-foreground">Entre em contato</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Entre em Contato
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Estamos aqui para ajudar! Entre em contato conosco através dos canais abaixo ou visite nossa instituição.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Email Card */}
          <Card className="border-primary/20 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-lg">E-mail</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <a 
                href={`mailto:${contactInfo.email}`}
                className="text-primary hover:underline break-all"
              >
                {contactInfo.email}
              </a>
            </CardContent>
          </Card>

          {/* Phone Card */}
          <Card className="border-primary/20 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-secondary/10 rounded-full">
                  <Phone className="h-8 w-8 text-secondary" />
                </div>
              </div>
              <CardTitle className="text-lg">Telefone</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <a 
                href={`tel:${contactInfo.phone.replace(/\D/g, '')}`}
                className="text-primary hover:underline"
              >
                {contactInfo.phone}
              </a>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card className="border-primary/20 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-lg">Localização</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                {contactInfo.location}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Social Media Section */}
        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Redes Sociais</CardTitle>
            <p className="text-muted-foreground mt-2">
              Siga-nos nas redes sociais e fique por dentro das novidades
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center space-x-2 px-6 py-3 border border-border rounded-lg transition-all ${social.color}`}
                >
                  <social.icon className="h-5 w-5" />
                  <span>{social.label}</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-12 p-6 bg-accent rounded-lg border border-accent-foreground/20">
          <h3 className="font-semibold text-accent-foreground mb-3 text-center text-xl">
            Sobre o Projeplac
          </h3>
          <p className="text-accent-foreground/80 text-center max-w-2xl mx-auto">
            O Projeplac é o portal oficial para divulgação de projetos acadêmicos da UNICEPLAC. 
            Nossa missão é conectar estudantes, professores e a comunidade através da inovação e do conhecimento.
          </p>
        </div>
      </div>
    </div>
  );
}
