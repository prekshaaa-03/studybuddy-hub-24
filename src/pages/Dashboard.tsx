import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Calendar, BookOpen, LogOut, Clock } from "lucide-react";

export default function Dashboard() {
  const [taskName, setTaskName] = useState("");
  const [studyDate, setStudyDate] = useState("");
  const [studyHour, setStudyHour] = useState("12");
  const [studyMinute, setStudyMinute] = useState("00");
  const [amPm, setAmPm] = useState("AM");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    };
    checkAuth();
  }, [navigate]);

  const logout = async () => {
    await supabase.auth.signOut();
    toast.info("You have been logged out");
    navigate("/auth");
  };

  const startSession = () => {
    if (taskName && studyDate && studyHour && studyMinute) {
      const hours = parseInt(studyHour, 10);
      const minutes = parseInt(studyMinute, 10);
      const adjustedHours = amPm === "PM" && hours !== 12 ? hours + 12 : amPm === "AM" && hours === 12 ? 0 : hours;

      const studyDateTime = `${studyDate}T${String(adjustedHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
      const now = new Date();
      const selectedDateTime = new Date(studyDateTime);

      if (selectedDateTime < now) {
        toast.error("You cannot schedule a task in the past");
      } else {
        const newTask = {
          taskName,
          studyDateTime,
          completed: false,
          id: new Date().getTime(),
        };

        const tasks = JSON.parse(localStorage.getItem("studyTasks") || "[]");
        tasks.push(newTask);
        localStorage.setItem("studyTasks", JSON.stringify(tasks));

        toast.success(`Scheduled: ${taskName} for ${studyDate} at ${studyHour}:${studyMinute} ${amPm}`);
        navigate("/calendar");
      }
    } else {
      toast.error("Please fill in all fields");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-primary shadow-medium p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-primary-foreground">Lock In.</div>
          <nav className="flex gap-4 items-center">
            <Button variant="ghost" onClick={() => navigate("/calendar")} className="text-primary-foreground hover:bg-primary-light">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Button>
            <Button variant="ghost" onClick={() => navigate("/library")} className="text-primary-foreground hover:bg-primary-light">
              <BookOpen className="mr-2 h-4 w-4" />
              Library
            </Button>
            <Button variant="ghost" onClick={logout} className="text-primary-foreground hover:bg-primary-light">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="p-8 bg-card shadow-soft hover:shadow-medium transition-shadow">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">Schedule a Study Session</h2>
            
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Task Name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full"
              />

              <Input
                type="date"
                value={studyDate}
                onChange={(e) => setStudyDate(e.target.value)}
                className="w-full"
              />

              <div className="grid grid-cols-3 gap-2">
                <Input
                  type="number"
                  placeholder="HH"
                  value={studyHour}
                  onChange={(e) => setStudyHour(e.target.value)}
                  min="1"
                  max="12"
                />
                <Input
                  type="number"
                  placeholder="MM"
                  value={studyMinute}
                  onChange={(e) => setStudyMinute(e.target.value)}
                  min="0"
                  max="59"
                />
                <select
                  value={amPm}
                  onChange={(e) => setAmPm(e.target.value)}
                  className="border border-input rounded-md px-3 bg-background"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>

              <Button onClick={startSession} className="w-full bg-gradient-primary hover:opacity-90">
                <Clock className="mr-2 h-4 w-4" />
                Schedule Session
              </Button>
            </div>
          </Card>

          <div className="space-y-4">
            <Card 
              className="p-6 bg-accent text-accent-foreground hover:scale-105 transition-transform cursor-pointer shadow-soft"
              onClick={() => navigate("/calendar")}
            >
              <Calendar className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">View Calendar</h3>
              <p className="text-sm">See all your scheduled study sessions</p>
            </Card>

            <Card 
              className="p-6 bg-highlight text-highlight-foreground hover:scale-105 transition-transform cursor-pointer shadow-soft"
              onClick={() => navigate("/library")}
            >
              <BookOpen className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Browse Library</h3>
              <p className="text-sm">Access free educational resources</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
