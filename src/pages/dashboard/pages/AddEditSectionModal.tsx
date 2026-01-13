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

interface AddEditSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number | null, name: string, seeMore: string) => void;
  currentSection?: { id: number | null; name: string; seeMore?: string };
  loading: boolean;
  err?: any;
}

export default function AddEditSectionModal({
  isOpen,
  onClose,
  onSave,
  currentSection,
  loading,
  err,
}: AddEditSectionModalProps) {
  const [name, setName] = useState(currentSection?.name || "");
  const [seeMore, setSeeMore] = useState(currentSection?.seeMore || "");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Reset state when modal opens or currentSection changes
  useEffect(() => {
    setName(currentSection?.name || "");
    setSeeMore(currentSection?.seeMore || "");
    setError(null);
  }, [currentSection, isOpen]);

  const handleSave = () => {
    if (name.trim() === "") {
      setError("Section name cannot be empty");
      return;
    }
    
    if (seeMore.trim() === "") {
      setError("Section seeMore cannot be empty");
      return;
    }

    try {
      onSave(currentSection?.id || null, name.trim(), seeMore.trim());
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
          <DialogTitle>{currentSection ? "Edit Section" : "Add Section"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <InputField
            type="text"
            placeholder="Enter section name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            errorMessage={error && error.includes("name") ? error : undefined}
          />

          <InputField
            type="text"
            placeholder="Enter seeMore link"
            value={seeMore}
            onChange={(e) => {
              setSeeMore(e.target.value);
              setError(null);
            }}
            errorMessage={error && error.includes("seeMore") ? error : undefined}
          />
        </div>

        {/* Error Alert */}
        {err && "data" in err && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Section Error</AlertTitle>
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
            disabled={!name.trim() || !seeMore.trim()}
          >
            {loading && <ButtonLoader />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}