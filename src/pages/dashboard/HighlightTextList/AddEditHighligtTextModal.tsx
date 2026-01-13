import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ButtonLoader from "@/components/loader/ButtonLoader";
interface AddEditHighlightTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number | null, text: string) => void; 
  currentHighlightText?: { id: number | null; text: string };
  loading: boolean;
  err?: any;
}

export default function AddEditHighlightTextModal({
  isOpen,
  onClose,
  onSave,
  currentHighlightText,
  loading,
  err,
}: AddEditHighlightTextModalProps) {
  const [text, setText] = useState(currentHighlightText?.text || "");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  useEffect(() => {
    setText(currentHighlightText?.text || "");
    setError(null);
  }, [currentHighlightText]);

  const handleSave = () => {
    if (text.trim() === "") {
      setError("Highlight text cannot be empty");
      return;
    }
    try {
      
      onSave(currentHighlightText?.id || null, text.trim()); // Pass both arguments
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong! Please try again.",
        variant: "destructive",
      });
      setError(null); 
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{currentHighlightText ? "Edit Highlight Text" : "Add Highlight Text"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <InputField
            type="text"
            placeholder="Enter Highlight Text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError(null); // Clear error on input change
            }}
            errorMessage={error || undefined} // Pass error message to InputField
          />
        </div>
         {/* Error Alert */}
         {err && "data" in err && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Color Error</AlertTitle>
            <AlertDescription>
              {(err.data as { message?: string })?.message ||
                "Something went wrong! Please try again."}
            </AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-500 text-white"
            disabled={!text.trim()} // Disable save button if input is empty
          >
           {loading && <ButtonLoader />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
