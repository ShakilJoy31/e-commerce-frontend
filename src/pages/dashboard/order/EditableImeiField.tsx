import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";

const EditableImeiField = ({ item, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(item.imei || item.serialNo || '');
  
  const handleSave = () => {
    onUpdate(item.id, item.colorId, {
      [item.category?.toLowerCase() === 'phone' ? 'imei' : 'serialNo']: value
    });
    setIsEditing(false);
  };


  return (
    <div className="text-sm text-gray-600 mt-1">
      {item?.category?.toLowerCase() === 'phone' ? 'IMEI: ' : 'Serial No: '}
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border p-1 rounded text-xs w-32"
          />
          <button 
            onClick={handleSave}
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
          >
            Save
          </button>
          <button 
            onClick={() => setIsEditing(false)}
            className="text-xs bg-gray-200 px-2 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      ) : (
        <span>
          {value || 'Not provided'}
          <button 
            onClick={() => setIsEditing(true)}
            className="ml-2 text-blue-500 text-xs"
          >
            <FiEdit2 size={15}/>
          </button>
        </span>
      )}
    </div>
  );
};

export default EditableImeiField 