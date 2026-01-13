import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Asterisk } from "lucide-react";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-dropdown-menu";

interface BranchData {
  id?: number | null;
  name: string;
  map: string;
  address: string;
  phone1: string;
  phone2: string | undefined;
  offDay: string;
  facebook: string | undefined;
  isBranchPickup: boolean;
  serialNo: number;
}

interface AddEditBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number | null, data: BranchData) => void;
  currentBranch?: BranchData | null;
  loading: boolean;
  err?: any;
}

const daysOfWeek = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "No Off Day"
];

const AddEditBranchModal = ({
  isOpen,
  onClose,
  onSave,
  currentBranch,
  loading,
  err,
}: AddEditBranchModalProps) => {
  const [name, setName] = useState("");
  const [map, setMap] = useState("");
  const [address, setAddress] = useState("");
  const [phone1, setPhone1] = useState("");
  const [serialNo, setSerialNo] = useState<number>(0);
  const [phone2, setPhone2] = useState("");
  const [offDay, setOffDay] = useState("");
  const [facebook, setFacebook] = useState("");
  const [isBranchPickup, setIsBranchPickup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();


  useEffect(() => {
    if (currentBranch) {
      setName(currentBranch.name || "");
      setMap(currentBranch.map || "");
      setAddress(currentBranch.address || "");
      setPhone1(currentBranch.phone1 || "");
      setPhone2(currentBranch.phone2 || "");
      setOffDay(currentBranch.offDay || "");
      setFacebook(currentBranch.facebook || "");
      setIsBranchPickup(currentBranch?.isBranchPickup);
      setSerialNo(currentBranch?.serialNo);
    } else {
      setName("");
      setMap("");
      setAddress("");
      setPhone1("");
      setPhone2("");
      setOffDay("");
      setFacebook("");
      setSerialNo(0);
    }
    setError(null);
  }, [currentBranch, isOpen]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Branch name is required");
      return;
    }

    try {
      const data: BranchData = {
        name,
        map,
        address,
        phone1,
        phone2: phone2.trim() ? phone2 : undefined,
        offDay,
        facebook: facebook.trim() ? facebook : undefined,
        isBranchPickup,
        serialNo: Number(serialNo) || 0,
      };

      onSave(currentBranch?.id || null, data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong! Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {currentBranch ? "Edit Branch" : "Add Branch"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label>
              Serial Number <span className="text-red-600">✽</span>
            </label>
            <Input
              type="number"
              placeholder="Enter Serial Number"
              value={serialNo.toString()}
              onChange={(e) => setSerialNo(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="flex items-center gap-1">
              <span>Branch Name</span>
              <Asterisk className="w-3 h-3 text-red-500" />
            </Label>
            <input
              name="name"
              placeholder="Enter branch name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? "border-red-500" : ""
              }`}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label className="flex items-center gap-1">
              <span>Address</span>
              <Asterisk className="w-3 h-3 text-red-500" />
            </Label>
            <textarea
              id="address"
              name="address"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={4}
              className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="flex items-center gap-1">
              <span>Off Day</span>
              <Asterisk className="w-3 h-3 text-red-500" />
            </Label>
            <Select value={offDay} onValueChange={setOffDay}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select off day" />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="flex items-center gap-1">
              <span>Phone 1</span>
              <Asterisk className="w-3 h-3 text-red-500" />
            </Label>
            <input
              name="phone1"
              placeholder="Enter primary phone number"
              value={phone1}
              onChange={(e) => setPhone1(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Phone 2 (Optional)</Label>
            <input
              name="phone2"
              placeholder="Enter secondary phone number"
              value={phone2}
              onChange={(e) => setPhone2(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Google Map</Label>
            <input
              name="map"
              placeholder="Enter map link"
              value={map}
              onChange={(e) => {
                setMap(e.target.value);
                if (error) setError(null);
              }}
              className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Facebook Link</Label>
            <input
              name="facebook"
              placeholder="Enter Facebook page URL"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-1 mt-3">
            <input
              type="checkbox"
              checked={isBranchPickup}
              onChange={(e) => setIsBranchPickup(e.target.checked)}
              className="w-5 h-4"
            />
            <label htmlFor="">Is Branch Pickup?</label>
          </div>
        </div>

        {err && "data" in err && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Branch Error</AlertTitle>
            <AlertDescription>
              {(err.data as { message?: string })?.message ||
                "Something went wrong! Please try again."}
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-500 text-white hover:bg-blue-600"
            disabled={!name.trim() || loading}
          >
            {loading && <ButtonLoader />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditBranchModal;
