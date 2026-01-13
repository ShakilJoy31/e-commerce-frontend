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
interface AddEditColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number | null, color: string) => void; // Updated to accept three arguments
  currentColor?: { id: number | null; color: string; colorCode: string };
  loading: boolean;
  err?: any;
}

export default function AddEditColorModal({
  isOpen,
  onClose,
  onSave,
  currentColor,
  loading,
  err,
}: AddEditColorModalProps) {
  const [color, setColor] = useState(currentColor?.color || "");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Reset color, colorCode, and error state when modal opens or currentColor changes
  useEffect(() => {
    setColor(currentColor?.color || "");
    setError(null);
  }, [currentColor]);

  const handleSave = () => {
    if (color.trim() === "") {
      setError("Color name cannot be empty");
      return;
    }

    try {
      onSave(currentColor?.id || null, color.trim());
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
          <DialogTitle>{currentColor ? "Edit Color" : "Add Color"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <InputField
            type="text"
            placeholder="Enter Color Name"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
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
            disabled={!color.trim()} 
          >
            {loading && <ButtonLoader />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
