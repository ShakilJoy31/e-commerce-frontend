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
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AddEditFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number | null, name: string) => void;
  currentFeature?: { id: number | null; name: string };
  loading: boolean;
  err?: any;
}

export default function AddEditFeatureModal({
  isOpen,
  onClose,
  onSave,
  currentFeature,
  loading,
  err
}: AddEditFeatureModalProps) {
  const [name, setName] = useState(currentFeature?.name || "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(currentFeature?.name || "");
    setError(null);
  }, [currentFeature]);

  const handleSave = () => {
    if (name.trim() === "") {
      setError("Feature name cannot be empty");
      return;
    }
    onSave(currentFeature?.id || null, name.trim());
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentFeature ? "Edit Attribute Key" : "Add Attribute Key"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <InputField
            type="text"
            placeholder="Enter Attribute Key"
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
            <AlertTitle>Attribute Key Error</AlertTitle>
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
           {loading && <ButtonLoader/>} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
