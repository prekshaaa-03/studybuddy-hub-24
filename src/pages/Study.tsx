import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, FileUp, Bold, Italic, Underline as UnderlineIcon, List, ListOrdered } from "lucide-react";

export default function Study() {
  const [searchParams] = useSearchParams();
  const taskName = searchParams.get("task") || "Study Session";
  const initialTime = parseInt(searchParams.get("time") || "1800");
  
  const [remainingTime, setRemainingTime] = useState(initialTime);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkAuth();

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.success("Study session complete! Great job! 🎉");
          navigate("/break");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setPdfUrl(URL.createObjectURL(file));
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatText = (command: string) => {
    document.execCommand(command, false);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="bg-gradient-primary shadow-medium p-4 flex justify-between items-center">
        <div className="text-xl font-bold text-primary-foreground">{taskName}</div>
        <div className="flex items-center gap-4">
          <div className="bg-accent px-6 py-2 rounded-lg text-accent-foreground font-bold text-lg">
            {formatTime(remainingTime)}
          </div>
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="text-primary-foreground hover:bg-primary-light">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Exit
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-6 overflow-auto bg-muted/30">
          <Card className="bg-card shadow-soft p-6 h-full">
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 rounded-lg w-fit transition-colors">
                <FileUp className="h-4 w-4" />
                Upload PDF
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                className="w-full h-[calc(100%-60px)] border-0 rounded-lg"
                title="PDF Viewer"
              />
            ) : (
              <div className="h-[calc(100%-60px)] flex items-center justify-center text-muted-foreground">
                <p>Upload a PDF to start studying</p>
              </div>
            )}
          </Card>
        </div>

        <div className="flex-1 p-6 overflow-auto bg-background">
          <Card className="bg-card shadow-soft p-6 h-full flex flex-col">
            <div className="flex gap-2 mb-4 p-2 bg-secondary rounded-lg">
              <Button size="sm" variant="ghost" onClick={() => formatText("bold")} className="text-secondary-foreground">
                <Bold className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => formatText("italic")} className="text-secondary-foreground">
                <Italic className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => formatText("underline")} className="text-secondary-foreground">
                <UnderlineIcon className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => formatText("insertUnorderedList")} className="text-secondary-foreground">
                <List className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => formatText("insertOrderedList")} className="text-secondary-foreground">
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>

            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Take notes here..."
              className="flex-1 resize-none border-input"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
