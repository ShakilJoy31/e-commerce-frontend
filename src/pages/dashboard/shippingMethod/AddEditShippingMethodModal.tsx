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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddEditShippingMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number | null, name: string, price: number, isActive: boolean, shipped: string) => void;
  currentTag?: { id: number | null; name: string; price?: number; isActive?: boolean; shipped?: string };
  loading: boolean;
  err?: any;
}

export default function AddEditShippingMethodModal({
  isOpen,
  onClose,
  onSave,
  currentTag,
  loading,
  err,
}: AddEditShippingMethodModalProps) {
  const [name, setName] = useState(currentTag?.name || "");
  const [price, setPrice] = useState<number>(currentTag?.price || 0);
  const [isActive, setIsActive] = useState(currentTag?.isActive ?? true);
  const [shipped, setShipped] = useState<string>(currentTag?.shipped || "In_Dhaka");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setName(currentTag?.name || "");
    setPrice(currentTag?.price || 0);
    setIsActive(currentTag?.isActive ?? true);
    setShipped(currentTag?.shipped || "In_Dhaka");
    setError(null);
  }, [currentTag]);

  const handleSave = () => {
    if (name.trim() === "") {
      setError("Courier name cannot be empty");
      return;
    }
    
    const priceNumber = (price);
    if (isNaN(priceNumber) || priceNumber < 0) {
      setError("Price must be a valid positive number");
      return;
    }
    
    try {
      onSave(currentTag?.id || null, name.trim(), price, isActive, shipped);
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
            {currentTag ? "Edit Shipping Method" : "Add Shipping Method"}
          </DialogTitle>
        </DialogHeader>
        <div className="">
          <label htmlFor="" className="font-medium">Shipping Method Name</label>
          <InputField
            type="text"
            placeholder="Enter shipping method name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            errorMessage={error?.includes('name') ? error : undefined}
          />
         <div>
            <label htmlFor="" className="font-medium">Price</label>
          <InputField
            type="text"
            placeholder="Enter price"
            value={price.toString()}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9.]/g, '');
              setPrice(Number(value));
              setError(null);
            }}
            errorMessage={error?.includes('price') ? error : undefined}
          />
         </div>
         
         {/* Required Shipping Coverage Dropdown */}
         <div>
          <label htmlFor="" className="font-medium">Shipped *</label>
          <Select
            value={shipped} 
            onValueChange={setShipped}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select coverage area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="hover:cursor-pointer" value="In_Dhaka">Inside Dhaka</SelectItem>
              <SelectItem className="hover:cursor-pointer" value="Out_Dhaka">Outside Dhaka</SelectItem>
              <SelectItem className="hover:cursor-pointer" value="Both">Both</SelectItem>
            </SelectContent>
          </Select>
         </div>

          <div className="flex items-center gap-1 mt-3">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-5 h-4"
          />
          <label htmlFor="">Is Active?</label>
        </div>
        </div>
        {err && "data" in err && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
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
            disabled={!name.trim() || isNaN(price)}
          >
            {loading && <ButtonLoader />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}