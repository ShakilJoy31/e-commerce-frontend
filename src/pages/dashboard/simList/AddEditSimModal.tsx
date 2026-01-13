import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { useToast } from "@/components/ui/use-toast";
interface AddEditSimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number | null, sim: string) => void;
  currentSim?: { id: number | null; sim: string };
  loading: boolean;
  err?: any;
}

export default function AddEditSimModal({
  isOpen,
  onClose,
  onSave,
  currentSim,
  loading,
  err,
}: AddEditSimModalProps) {
  const [sim, setSim] = useState(currentSim?.sim || "");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setSim(currentSim?.sim || "");
    setError(null);
  }, [currentSim]);

  const handleSave = () => {
    if (sim.trim() === "") {
      setError("SIM name cannot be empty");
      return;
    }
    try {
      onSave(currentSim?.id || null, sim.trim()); // Pass both arguments
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
          <DialogTitle>{currentSim ? "Edit SIM" : "Add SIM"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <InputField
            type="text"
            placeholder="Enter SIM Name"
            value={sim}
            onChange={(e) => {
              setSim(e.target.value);
              setError(null); // Clear error on input change
            }}
            errorMessage={error || undefined} // Pass error message to InputField
          />
        </div>
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
            disabled={!sim.trim()}
          >
           {loading && <ButtonLoader />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
