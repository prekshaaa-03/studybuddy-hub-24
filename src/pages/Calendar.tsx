import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Play } from "lucide-react";
import { api, getLocalUserId, type Goal } from "@/lib/api";

interface Task {
  id: number;
  taskName: string;
  studyDateTime: string;
  completed: boolean;
}

export default function Calendar() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkAuth();

    const loadGoals = async () => {
      try {
        const userId = getLocalUserId();
        const goals = await api.getGoals(userId);
        const mapped: Task[] = goals.map((g: Goal) => ({
          id: g.GoalID,
          taskName: g.Title,
          studyDateTime: g.DueDate,
          completed: false,
        }));
        setTasks(mapped);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load goals from local SQL API. Is the server running?");
      }
    };
    loadGoals();
  }, [navigate]);

  const deleteTask = async (id: number) => {
    try {
      await api.deleteGoal(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Task deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete goal");
    }
  };

  const startStudySession = (task: Task) => {
    navigate(`/study?task=${encodeURIComponent(task.taskName)}&time=1800`);
  };

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
        <h1 className="text-4xl font-bold mb-8 text-foreground">Your Study Calendar</h1>

        {tasks.length === 0 ? (
          <Card className="p-12 text-center bg-card shadow-soft">
            <p className="text-muted-foreground text-lg">No tasks scheduled yet. Go to the dashboard to add one!</p>
          </Card>
        ) : (
          <div className="grid gap-4 max-w-4xl">
            {tasks.map((task) => (
              <Card key={task.id} className="p-6 bg-card shadow-soft hover:shadow-medium transition-shadow">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-card-foreground mb-2">{task.taskName}</h3>
                    <p className="text-muted-foreground">
                      {new Date(task.studyDateTime).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => startStudySession(task)} 
                      className="bg-accent hover:bg-accent/90"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
