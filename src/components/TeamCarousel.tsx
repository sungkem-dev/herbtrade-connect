interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Raihan Adz Dzikra",
    role: "Leader",
    image: "yan.jpg",
  },
  {
    name: "Iriena Feyza Zafira Rosyidi",
    role: "Research and Development",
    image: "zaf.jpg",
  },
  {
    name: "Fionna Nur Illahi",
    role: "Business Manager",
    image: "fio.jpg",
  },
  {
    name: "Dustin Favian Baihaqi",
    role: "Marketing Director",
    image: "dus.JPG",
  },
  {
    name: "Aulia Rahmah Fitriah",
    role: "Research and Development",
    image: "aul.JPG",
  },
  {
    name: "Muhammad Fariz Abid R",
    role: "Backend Developer",
    image: "nyam.jpg",
  },
  {
    name: "Topan Suryadi Laga",
    role: "Frontend Developer",
    image: "Topan.jpg",
  }
];

export const TeamCarousel = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
      {teamMembers.map((member) => (
        <div 
          key={member.name}
          className="flex gap-6 items-start bg-card rounded-lg p-4 hover:shadow-lg transition-all duration-300 border border-border/30"
        >
          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="w-32 h-40 rounded-lg overflow-hidden bg-muted">
              <img 
                src={member.image} 
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Info */}
          <div className="flex flex-col justify-center pt-2">
            <h3 className="text-lg font-bold text-foreground leading-tight mb-3">
              {member.name}
            </h3>
            <div className="flex items-start gap-2">
              <div className="w-1 h-10 bg-primary rounded-full flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {member.role}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
