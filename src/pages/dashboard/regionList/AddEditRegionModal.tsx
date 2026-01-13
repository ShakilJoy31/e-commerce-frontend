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

interface AddEditRegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number | null, region: string) => void;
  currentRegion?: { id: number | null; region: string };
  loading: boolean;
  err?: any;
}

export default function AddEditRegionModal({
  isOpen,
  onClose,
  onSave,
  currentRegion,
  loading,
  err,
}: AddEditRegionModalProps) {
  const [region, setRegion] = useState(currentRegion?.region || "");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  // Reset region and error state when modal opens or currentRegion changes
  useEffect(() => {
    setRegion(currentRegion?.region || "");
    setError(null);
  }, [currentRegion]);

  const handleSave = () => {
    if (region.trim() === "") {
      setError("Region name cannot be empty");
      return;
    }
    try {
      onSave(currentRegion?.id || null, region.trim());
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
            {currentRegion ? "Edit Region" : "Add Region"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <InputField
            type="text"
            placeholder="Enter Region Name"
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
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
            disabled={!region.trim()}
          >
            {loading && <ButtonLoader />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
