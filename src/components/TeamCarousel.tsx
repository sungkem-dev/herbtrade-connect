import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  initials: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Ahmad Kurniawan",
    role: "CEO & Founder",
    image: "yan.jpg",
    initials: "AK"
  },
  {
    name: "Siti Rahayu",
    role: "CTO",
    image: "zaf.jpg",
    initials: "SR"
  },
  {
    name: "Budi Santoso",
    role: "Head of Operations",
    image: "fio.jpg",
    initials: "BS"
  },
  {
    name: "Dewi Lestari",
    role: "Marketing Director",
    image: "dus.jpg",
    initials: "DL"
  },
  {
    name: "Rizky Pratama",
    role: "Product Manager",
    image: "aul.jpg",
    initials: "RP"
  },
  {
    name: "Anisa Putri",
    role: "Head of Partnerships",
    image: "nyam.jpg",
    initials: "AP"
  },
  {
    name: "Fahri Rahman",
    role: "Lead Developer",
    image: "https://randomuser.me/api/portraits/men/91.jpg",
    initials: "FR"
  }
];

export const TeamCarousel = () => {
  const duplicatedMembers = [...teamMembers, ...teamMembers];

  return (
    <div className="relative overflow-hidden py-4">
      <motion.div
        className="flex gap-6"
        animate={{
          x: [0, -50 * teamMembers.length * 4.5],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {duplicatedMembers.map((member, index) => (
          <Card 
            key={`${member.name}-${index}`}
            className="flex-shrink-0 w-64 hover:shadow-lg transition-all duration-300 glass-card border-border/50"
          >
            <CardContent className="pt-6 text-center">
              <Avatar className="w-20 h-20 mx-auto mb-4 ring-2 ring-primary/20">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
              <p className="text-sm text-primary font-medium">{member.role}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>
      
      {/* Gradient overlays for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
    </div>
  );
};
