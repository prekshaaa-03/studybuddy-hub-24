import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const breakPrompts = [
  {
    prompt: "Take a 5-minute stretch!",
    url: "https://www.everydayhealth.com/fitness/quickstretches-for-stress-relief/",
  },
  {
    prompt: "Listen to a relaxing song!",
    url: "https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY",
  },
  {
    prompt: "Go for a quick walk!",
    url: "https://www.walksforhealth.org.uk/",
  },
  {
    prompt: "Drink some water!",
    url: "https://www.medicalnewstoday.com/articles/322228",
  },
  {
    prompt: "Meditate for 5 minutes!",
    url: "https://www.headspace.com/meditation/5-minute-meditation",
  },
];

export default function Break() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % breakPrompts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + breakPrompts.length) % breakPrompts.length);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    toast.info("You have been logged out");
    navigate("/auth");
  };

  const currentPrompt = breakPrompts[currentIndex];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-primary shadow-medium p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-primary-foreground">Lock In.</div>
          <Button variant="ghost" onClick={logout} className="text-primary-foreground hover:bg-primary-light">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-12 text-center text-foreground">Take a Break!</h1>

        <div className="flex items-center justify-center gap-8 max-w-4xl mx-auto">
          <Button
            onClick={handlePrev}
            size="lg"
            className="bg-accent hover:bg-accent/90"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Card
            className="flex-1 p-12 text-center bg-gradient-accent shadow-medium hover:shadow-lg transition-all cursor-pointer"
            onClick={() => window.open(currentPrompt.url, "_blank")}
          >
            <p className="text-3xl font-bold text-card-foreground">{currentPrompt.prompt}</p>
            <p className="text-sm text-muted-foreground mt-4">Click to learn more</p>
          </Card>

          <Button
            onClick={handleNext}
            size="lg"
            className="bg-accent hover:bg-accent/90"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>

        <div className="text-center mt-12">
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-primary hover:opacity-90"
          >
            Back to Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}
