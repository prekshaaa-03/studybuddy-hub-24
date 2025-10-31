import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Brain, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 text-foreground">
            Lock In.
          </h1>
          <p className="text-2xl text-muted-foreground mb-8">
            Your focused study companion for academic success
          </p>
          <Button 
            onClick={() => navigate("/auth")}
            size="lg"
            className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </header>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all hover:scale-105">
            <Calendar className="h-12 w-12 mb-4 text-accent" />
            <h3 className="text-xl font-bold mb-2 text-card-foreground">Schedule Sessions</h3>
            <p className="text-muted-foreground">
              Plan and organize your study time with our intuitive calendar system
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all hover:scale-105">
            <Brain className="h-12 w-12 mb-4 text-accent" />
            <h3 className="text-xl font-bold mb-2 text-card-foreground">Focused Study</h3>
            <p className="text-muted-foreground">
              PDF viewer with note-taking tools to maximize your learning
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all hover:scale-105">
            <BookOpen className="h-12 w-12 mb-4 text-accent" />
            <h3 className="text-xl font-bold mb-2 text-card-foreground">Free Resources</h3>
            <p className="text-muted-foreground">
              Access curated educational materials from trusted sources
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
