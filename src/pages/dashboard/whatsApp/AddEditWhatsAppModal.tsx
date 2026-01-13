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

interface AddEditWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number | null, number: string) => void; // Changed 'number' to string for phone numbers
  currentWhatsApp?: { id: number | null; number: string };
  loading: boolean;
  err?: any;
}

export default function AddEditWhatsAppModal({
  isOpen,
  onClose,
  onSave,
  currentWhatsApp,
  loading,
  err,
}: AddEditWhatsAppModalProps) {
  const [number, setNumber] = useState(currentWhatsApp?.number || "");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  useEffect(() => {
    setNumber(currentWhatsApp?.number || "");
    setError(null);
  }, [currentWhatsApp]);

  const handleSave = () => {
    if (number.trim() === "") {
      setError("Phone number is required");
      return;
    }

    try {
      onSave(currentWhatsApp?.id || null, number.trim()); // Pass both id and number
    } catch (error) {
      console.error("Error saving WhatsApp contact", error);
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
            {currentWhatsApp ? "Edit WhatsApp Contact" : "Add WhatsApp Contact"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <InputField
            type="text"
            placeholder="Enter Phone Number"
            value={number}
            onChange={(e) => {
              setNumber(e.target.value);
              setError(null); // Clear error on input change
            }}
            errorMessage={
              error && !number ? "Phone number cannot be empty" : undefined
            } // Error for phone number
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
            disabled={!number.trim()} // Disable Save if number is empty
          >
            {loading && <ButtonLoader />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
