import { GraduationCap, Briefcase } from "lucide-react";

interface ProfileIconProps {
  type: "aluno" | "professor";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function ProfileIcon({ type, size = "md", className = "" }: ProfileIconProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  const iconSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-6 w-6",
    xl: "h-8 w-8"
  };

  if (type === "aluno") {
    return (
      <div 
        className={`${sizeClasses[size]} rounded-full bg-primary/10 flex items-center justify-center ${className}`}
        title="Aluno"
      >
        <GraduationCap className={`${iconSize[size]} text-primary`} />
      </div>
    );
  }

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full bg-secondary/10 flex items-center justify-center ${className}`}
      title="Professor"
    >
      <Briefcase className={`${iconSize[size]} text-secondary`} />
    </div>
  );
}
