import { CirclePlus } from "lucide-react";

const AddressCard: React.FC<{
  title: string;
  address: string[];
  onEdit: () => void;
}> = ({ title, address, onEdit }) => {
  return (
    <div className="w-full md:w-1/2 p-4">
      <div className="border rounded-lg shadow-sm p-5">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h3 className="font-semibold text-gray-700">{title}</h3>
          <button
            onClick={onEdit}
            className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"
          >
            Edit <CirclePlus className="w-4 h-4" />
          </button>
        </div>
        <div className="text-gray-600 text-sm leading-relaxed">
          {address.length > 0 ? (
            address.map((line, index) => (
              <p className="pt-2" key={`${line}-${index}`}>
                {line}
              </p>
            ))
          ) : (
            <p className="pt-2 text-gray-400">No address provided.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
