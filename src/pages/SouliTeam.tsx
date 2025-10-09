import { Button } from "@/components/ui/button";
import { ArrowLeft, Linkedin, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dushyantImage from "@/assets/dushyant-kohli.png";
import devOmImage from "@/assets/dev-om.png";
import bhavnaImage from "@/assets/bhavna-khurana.png";
import SouliFooter from "@/components/SouliFooter";

const SouliTeam = () => {
  const navigate = useNavigate();

  const team = [
    {
      name: "Dushyant Kohli",
      role: "Co-founder and CEO",
      image: dushyantImage,
      bio: "Dushyant Kohli is a seasoned entrepreneur and Indian OTT veteran with co-founding experience (Khabri & Beatcast) and over a decade of CXO and growth hacking expertise. He has led B2C and B2B businesses across OTT, Edtech, podcasting, and gaming, and is also a certified Meditation teacher & Mindfulness Coach.",
      highlights: ["Co-founded Khabri & Beatcast", "Led B2C and B2B businesses across multiple industries", "MBA from Ecole Des Pont Business School"],
      linkedin: "https://www.linkedin.com/in/dushyantkohli/",
      email: "dk@ifindlife.com"
    },
    {
      name: "Dev OM",
      role: "Co-founder and Chief Mentor",
      image: devOmImage,
      bio: "With over 20 years of global experience in emotional and mental wellness coaching, Master Dev Om is a globally recognized mindfulness and meditation coach. He was directly trained by father of mindfulness - Thich Nhat Hanh and the Dalai Lama. He created 'Light Mindfulness Meditation,' authored 9 books, and has trained and certified hundreds of meditation & mindfulness coaches worldwide.",
      highlights: ["Creator of 'Light Mindfulness Meditation'", "Author of 9 books on mindfulness", "Trained by Thich Nhat Hanh and the Dalai Lama"],
      linkedin: "#",
      email: "dk@ifindlife.com"
    },
    {
      name: "Dr. Bhavna Khurana",
      role: "Cofounder & Program Director",
      image: bhavnaImage,
      bio: "Dr. Bhavna Khurana, with over 20 years of global experience, is a PhD scholar in Cardiac Wellness and a pioneer in heart disease reversal through lifestyle change and mindfulness. She is the founder of I AM Fit (Singapore) and Soulversity (UK), offering mind-body wellness solutions. A certified Lifestyle Medicine Practitioner, Mindfulness Coach, and Meditation Teacher, Dr. Bhavna specializes in workplace wellness and mental health support through global Employee Assistance Programs (EAPs).",
      highlights: ["PhD in Cardiac Wellness & Founder of I AM Fit", "Mindfulness Coach & Workplace Wellness Specialist", "Certified Lifestyle Medicine & Weight Management Coach"],
      linkedin: "#",
      email: "dk@ifindlife.com"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-background via-accent/5 to-primary/10">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-secondary/25 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 flex-1 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <Button
            onClick={() => navigate("/souli")}
            variant="ghost"
            className="mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Button>

          <div className="text-center space-y-6 mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Meet the <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Team</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The passionate minds behind Souli, dedicated to transforming mental wellness through AI innovation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-2 border-primary/20 rounded-3xl p-8 space-y-6 hover:scale-105 transition-all shadow-lg hover:shadow-2xl">
                  <div className="relative mx-auto w-48 h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">{member.name}</h3>
                    <p className="text-lg text-primary font-medium">{member.role}</p>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Key Highlights</p>
                    <ul className="space-y-1">
                      {member.highlights.map((highlight, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-center gap-4 pt-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full hover:scale-110 transition-transform"
                      asChild
                    >
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full hover:scale-110 transition-transform"
                      asChild
                    >
                      <a href={`mailto:${member.email}`}>
                        <Mail className="w-5 h-5" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button
              onClick={() => navigate("/souli")}
              variant="ghost"
              className="group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
      
      <SouliFooter />
    </div>
  );
};

export default SouliTeam;
