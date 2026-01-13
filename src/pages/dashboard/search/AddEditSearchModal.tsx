import ButtonLoader from "@/components/loader/ButtonLoader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface AddEditSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number | null, search: string) => void;
  currentSearch?: { id: number | null; search: string };
  loading: boolean;
  err?: any;
}

export default function AddEditSearchModal({
  isOpen,
  onClose,
  onSave,
  currentSearch,
  loading,
  err,
}: AddEditSearchModalProps) {
  const [search, setSearch] = useState(currentSearch?.search || "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSearch(currentSearch?.search || "");
    setError(null);
  }, [currentSearch]);

  const handleSave = () => {
    if (search.trim() === "") {
      setError("search name cannot be empty");
      return;
    }
    onSave(currentSearch?.id || null, search.trim());
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentSearch ? "Edit Search" : "Add Search"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <InputField
            type="text"
            placeholder="Enter search placeholder Name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setError(null); // Clear error on input change
            }}
            errorMessage={error || undefined} // Pass error message to InputField
          />
        </div>
        {/* Error Alert */}
        {err && "data" in err && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Search Error</AlertTitle>
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
            disabled={!search.trim()}
          >
            {loading && <ButtonLoader />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
