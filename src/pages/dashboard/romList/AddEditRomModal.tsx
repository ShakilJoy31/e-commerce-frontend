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

interface AddEditRomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number | null, rom: string) => void;
  currentRom?: { id: number | null; rom: string };
  loading: boolean;
  err?: any;
}

export default function AddEditRomModal({
  isOpen,
  onClose,
  onSave,
  currentRom,
  loading,
  err,
}: AddEditRomModalProps) {
  const [rom, setRom] = useState(currentRom?.rom || "");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setRom(currentRom?.rom || "");
    setError(null);
  }, [currentRom]);

  const handleSave = () => {
    if (rom.trim() === "") {
      setError("ROM size cannot be empty");
      return;
    }
    try {
      onSave(currentRom?.id || null, rom.trim()); // Pass both arguments
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
          <DialogTitle>{currentRom ? "Edit ROM" : "Add ROM"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <InputField
            type="text"
            placeholder="Enter ROM Size (e.g., 32GB, 64GB)"
            value={rom}
            onChange={(e) => {
              setRom(e.target.value);
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
            disabled={!rom.trim()} // Disable save button if input is empty
          >
            {loading && <ButtonLoader />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
