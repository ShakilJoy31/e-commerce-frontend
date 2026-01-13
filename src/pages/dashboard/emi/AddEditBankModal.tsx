import ButtonLoader from "@/components/loader/ButtonLoader";
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
interface AddEditBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number | null, name: string) => void;
  currentBank?: { id: number | null; name: string };
  loading: boolean;
  err?: any;
}

export default function AddEditBankModal({
  isOpen,
  onClose,
  onSave,
  currentBank,
  loading,
  err,
}: AddEditBankModalProps) {
  const [name, setName] = useState(currentBank?.name || "");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  // Reset bankName, bankCode, and error state when modal opens or currentBank changes
  useEffect(() => {
    setName(currentBank?.name || "");
    setError(null);
  }, [currentBank]);

  const handleSave = () => {
    if (name.trim() === "") {
      setError("Bank name and code cannot be empty");
      return;
    }

    try {
      onSave(currentBank?.id || null, name.trim());
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
          <DialogTitle>{currentBank ? "Edit Bank" : "Add Bank"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <InputField
            type="text"
            placeholder="Enter Bank Name"
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
            <AlertTitle>Bank Error</AlertTitle>
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
