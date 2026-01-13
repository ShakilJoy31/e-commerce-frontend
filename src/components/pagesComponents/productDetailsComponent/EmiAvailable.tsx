import { useGetBanksQuery } from "@/components/store/api/emi/bankApi";
import { useGetEmisQuery } from "@/components/store/api/emi/emiApi";
import { useState, useEffect } from "react";

const EmiAvailable = ({ price }: { price: number }) => {
  const { data: bankEmis, isLoading } = useGetEmisQuery({});
  const { data: banks, isLoading: bankLoading } = useGetBanksQuery({});
  
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [inputPrice, setInputPrice] = useState(price);

  // Set the first bank as the default selected bank when banks data is available
  useEffect(() => {
    if (banks?.data?.length && !selectedBank) {
      setSelectedBank(banks.data[0].name);
    }
  }, [banks, selectedBank]);

  if (isLoading || bankLoading) return <p>Loading EMI data...</p>;
  if (!bankEmis || !banks) return <p>No EMI data available</p>;

  const selectedBankData = banks?.data.find((bank: any) => bank.name === selectedBank);
  const emiPlans = bankEmis?.data.filter((emi: any) => emi.bankId === selectedBankData?.id);

  return (
    <div>
      <div className="flex w-full">
        {/* Bank List */}
        <div className="w-1/3 border-r-none lg:border-r p-1 md:p-4 overflow-y-auto">
          <h3 className="text-primary text-xs md:text-sm font-semibold mb-2">BANK NAME</h3>
          <ul>
            {banks?.data?.map((bank: any) => (
              <li
                key={bank.id}
                className={`p-1 md:p-2 cursor-pointer text-[10px] md:text-sm font-medium rounded-md ${
                  selectedBank === bank.name ? "bg-black text-white" : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedBank(bank.name)}
              >
                {bank.name}
              </li>
            ))}
          </ul>
        </div>

        {/* EMI Details */}
        <div className="w-2/3 p-1 md:p-4">
          <div className="flex gap-2 items-center justify-between mb-4">
            <span className="text-sm font-semibold">Amount</span>
            <input
              type="text"
              className="border rounded-md px-2 py-0.5 text-sm w-full focus:border-none border-primary"
              value={inputPrice.toString()}
              onChange={(e) => {
                const value = e.target.value.replace(/^0+/, "");
                setInputPrice(value ? Number(value) : 0);
              }}
            />
          </div>

          <div className="bg-gray-100 rounded-md px-3 py-2">
            <div className="grid grid-cols-3 gap-5 text-gray-500 text-[10px] md:text-xs font-semibold border-b pb-1">
              <span>Plan (Monthly)</span>
              <span>EMI</span>
              <span>Effective Cost</span>
            </div>

            {emiPlans.map((plan: any) => {
              const effectiveCost = inputPrice + (inputPrice * plan.charge) / 100;
              const emi = (effectiveCost / plan.month).toFixed(2);

              return (
                <div
                  key={plan.month}
                  className="flex gap-5 lg:gap-10 w-full items-center text-[10px] md:text-sm py-2 border-b last:border-0"
                >
                  <span className="font-semibold">{plan.month}</span>
                  <p className="flex flex-col w-full">
                    <span className="text-primary font-semibold">BDT {emi}</span>
                    <span className="">( EMI Charge {plan.charge}% )</span>
                  </p>
                  <span className="text-primary font-semibold">
                    {effectiveCost.toFixed(0)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmiAvailable;
