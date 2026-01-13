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

interface AddEditWarrantyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number | null, name: string) => void;
  currentWarranty?: { id: number | null; name: string };
  loading: boolean;
  err?: any;
}

export default function AddEditWarrantyModal({
  isOpen,
  onClose,
  onSave,
  currentWarranty,
  loading,
  err,
}: AddEditWarrantyModalProps) {
  const [name, setName] = useState(currentWarranty?.name || "");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  // Reset ram and error state when modal opens or currentRam changes
  useEffect(() => {
    setName(currentWarranty?.name || "");
    setError(null);
  }, [currentWarranty]);

  const handleSave = () => {
    if (name.trim() === "") {
      setError("Warranty size cannot be empty");
      return;
    }
    try {
      onSave(currentWarranty?.id || null, name.trim());
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
          <DialogTitle>{currentWarranty ? "Edit Warranty" : "Add Warranty"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <InputField
            type="text"
            placeholder="Enter Warranty Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            errorMessage={error || undefined}
          />
        </div>
        {/* Error Alert */}
        {err && "data" in err && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warranty Error</AlertTitle>
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
            disabled={!name.trim()}
          >
            {loading && <ButtonLoader />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
