import ButtonLoader from "@/components/loader/ButtonLoader";
import { useGetBanksQuery } from "@/components/store/api/emi/bankApi";
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
import { useToast } from "@/components/ui/use-toast";


const DUMMY_BANKS = [
  { id: 5, name: "AB BANK LIMITED" },
  { id: 7, name: "AL-ARAFAH ISLAMI BANK LIMITID" },
  { id: 8, name: "BANK ASIA LIMITED" },
  { id: 37, name: "Community Bank Bangladesh Limited" },
  { id: 11, name: "DHAKA BANK LIMITED" },
  { id: 12, name: "DUTCH BANGLA BANK" },
  { id: 13, name: "EASTERN BANK" },
  { id: 14, name: "EXIM BANK" },
  { id: 15, name: "ISLAMI BANK BANGLADESH" },
  { id: 16, name: "JAMUNA BANK" },
  { id: 17, name: "LANKABANGLA FINANCE" },
  { id: 34, name: "Meghna Bank Limited" },
  { id: 18, name: "MERCANTILE BANK" },
  { id: 36, name: "Midland Bank Ltd" },
  { id: 31, name: "Modhumoti Bank Limited" },
  { id: 19, name: "MUTUAL TRUST BANK" },
  { id: 20, name: "NCC BANK" },
  { id: 33, name: "NRB Bank Limited" },
  { id: 32, name: "NRB COMMERCIAL BANK LTD" },
  { id: 21, name: "ONE BANK" }
];


interface AddEditEmiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: {
    id: number | null;
    bankId: number;
    month: number;
    charge: number;
  }) => void;
  currentEmi?: {
    id: number | null;
    bankId: number;
    month: number;
    charge: number;
  };
  loading: boolean;
  err?: any;
}

export default function AddEditEmiModal({
  isOpen,
  onClose,
  onSave,
  currentEmi,
  loading,
  err,
}: AddEditEmiModalProps) {
  const [bankId, setBankId] = useState<number | "">(currentEmi?.bankId || "");
  const [month, setMonth] = useState<number | "">(currentEmi?.month || "");
  const [charge, setCharge] = useState<number | "">(currentEmi?.charge || "");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  // Fetch banks for the dropdown
  const {
    data: banks,
    isLoading: isBanksLoading,
    isError: isBanksError,
  } = useGetBanksQuery({});

  console.log(banks) //! Use this dynamic bank data when bank is dynamically added. 

  // Reset state when modal opens or currentEmi changes
  useEffect(() => {
    setBankId(currentEmi?.bankId || 0);
    setMonth(currentEmi?.month || 0);
    setCharge(currentEmi?.charge || 0);
    setError(null);
  }, [currentEmi]);

  const handleSave = () => {
    if (!bankId || !month || !charge) {
      setError("All fields are required");
      return;
    }

    try {
      onSave({
        id: currentEmi?.id || null,
        bankId: bankId as number,
        month: month as number,
        charge: charge as number,
      });
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
            {currentEmi ? "Edit EMI Plan" : "Add EMI Plan"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Bank Dropdown */}
          <div>
            <label
              htmlFor="bank"
              className="block text-sm font-medium text-gray-700"
            >
              Select Bank
            </label>
            <select
              id="bank"
              value={bankId === 0 ? "" : bankId} // Ensure default "Select a bank" is shown
              onChange={(e) => {
                setBankId(Number(e.target.value) || ""); // Allow empty selection initially
                setError(null);
              }}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="" disabled>
                {isBanksLoading
                  ? "Loading banks..."
                  : isBanksError
                  ? "Failed to load banks"
                  : "Select a bank"}
              </option>
              {DUMMY_BANKS?.map((bank: any) => (
                <option key={bank.id} value={bank.id}>
                  {bank.name}
                </option>
              ))}
            </select>
            {error && !bankId && (
              <p className="text-red-500 text-sm mt-1">Bank is required</p>
            )}
          </div>

          <div>
            <label htmlFor="">EMI Month</label>
            <InputField
              type="number"
              placeholder="Enter EMI Month"
              value={month === "" ? "" : String(month)}
              onChange={(e) => {
                setMonth(e.target.value ? Number(e.target.value) : "");
                setError(null);
              }}
              errorMessage={error && !month ? "Month is required" : undefined}
            />
          </div>

          <div>
            <label htmlFor="">EMI Charge (%)</label>
            <InputField
              type="number"
              placeholder="Enter EMI Charge"
              value={charge === "" ? "" : String(charge)}
              onChange={(e) => {
                setCharge(e.target.value ? Number(e.target.value) : "");
                setError(null);
              }}
              errorMessage={error && !charge ? "Charge is required" : undefined}
            />
          </div>
        </div>
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
            disabled={!bankId || !month || !charge}
          >
            {loading && <ButtonLoader />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
