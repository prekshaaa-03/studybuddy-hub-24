import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ExternalLink } from "lucide-react";

const resources = [
  {
    title: "Project Gutenberg",
    url: "https://www.gutenberg.org/",
    description: "Access over 60,000 free eBooks, from classic literature to modern works.",
  },
  {
    title: "Internet Archive",
    url: "https://archive.org/details/texts",
    description: "Explore millions of free books, videos, and other digital media.",
  },
  {
    title: "Google Scholar",
    url: "https://scholar.google.com/",
    description: "Search for academic articles, theses, and scholarly books.",
  },
  {
    title: "Open Library",
    url: "https://www.openlibrary.org/",
    description: "Borrow free eBooks from an ever-growing online collection.",
  },
  {
    title: "Khan Academy",
    url: "https://www.khanacademy.org/",
    description: "Free courses and practice in math, science, and more.",
  },
  {
    title: "Coursera",
    url: "https://www.coursera.org/",
    description: "Online courses from top universities and companies.",
  },
];

export default function Library() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-primary shadow-medium p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-primary-foreground">Lock In.</div>
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="text-primary-foreground hover:bg-primary-light">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Online Library</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Discover free and trusted online resources for learning and personal growth.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {resources.map((resource, index) => (
              <Card 
                key={index} 
                className="p-6 bg-card shadow-soft hover:shadow-medium transition-all hover:scale-105 cursor-pointer group"
                onClick={() => window.open(resource.url, "_blank")}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-card-foreground group-hover:text-accent transition-colors">
                    {resource.title}
                  </h3>
                  <ExternalLink className="h-5 w-5 text-accent" />
                </div>
                <p className="text-muted-foreground">{resource.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
