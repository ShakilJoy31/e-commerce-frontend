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
interface AddEditChipsetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number | null, chipset: string) => void;
  currentChipset?: { id: number | null; chipset: string };
  loading: boolean;
  err?: any;
}

export default function AddEditChipsetModal({
  isOpen,
  onClose,
  onSave,
  currentChipset,
  loading,
  err,
}: AddEditChipsetModalProps) {
  const [chipset, setChipset] = useState(currentChipset?.chipset || "");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  // Reset chipset and error state when modal opens or currentChipset changes
  useEffect(() => {
    setChipset(currentChipset?.chipset || "");
    setError(null);
  }, [currentChipset]);

  const handleSave = () => {
    if (chipset.trim() === "") {
      setError("Chipset name cannot be empty");
      return;
    }
    try {
      onSave(currentChipset?.id || null, chipset.trim());
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
          <DialogTitle>
            {currentChipset ? "Edit Chipset" : "Add Chipset"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <InputField
            type="text"
            placeholder="Enter Chipset Name"
            value={chipset}
            onChange={(e) => {
              setChipset(e.target.value);
              setError(null);
            }}
            errorMessage={error || undefined}
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
            disabled={!chipset.trim()}
          >
            {loading && <ButtonLoader />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
