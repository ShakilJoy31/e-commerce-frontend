import { useEffect } from "react";
import { CiGift } from "react-icons/ci";

interface Gift {
  id: number;
  name: string;
  image?: string;
  quantity: number;
}

interface ProductGift {
  id: number;
  gift: Gift;
  giftId: number;
  productId: number;
}

interface GiftProductsProps {
  details: ProductGift[];
  setGiftId: (id: number) => void;
  giftId?: number | null;
}

const GiftProducts = ({ details, setGiftId, giftId }: GiftProductsProps) => {
     useEffect(() => {
    if (details?.length > 0 && giftId === null) {
      setGiftId(details[0].gift.id);
    }
  }, [details, giftId, setGiftId]);
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 max-w-md mx-auto">
      <div className="text-left mb-4 flex items-center">
        <CiGift size={40} className="text-primary"/>
        <div><h2 className="text-sm text-primary font-bold">GIFT FROM KRY</h2>
        <p className="text-gray-600 text-xs">Choose your free gift</p></div>
      </div>

      {details?.map((item) => (
        <div
          key={item.gift.id}
          onClick={() => setGiftId(item.gift.id)}
          className={`flex items-center p-2 border rounded-md mb-2 cursor-pointer transition-colors ${
            giftId === item.gift.id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          <input
            type="radio"
            id={`gift-${item.gift.id}`}
            name="gift"
            checked={giftId === item.gift.id}
            onChange={() => setGiftId(item.gift.id)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
          />

          {item.gift.image && (
            <div className="ml-3 mr-4 w-12 h-12 flex-shrink-0">
              <img
                src={item.gift.image}
                alt={item.gift.name}
                className="object-cover"
              />
            </div>
          )}

          <label
            htmlFor={`gift-${item.gift.id}`}
            className="ml-3 flex-grow cursor-pointer"
          >
            <div className="font-medium text-sm">
              {item.gift.name} x {item.gift.quantity}
            </div>
          </label>
        </div>
      ))}
    </div>
  );
};

export default GiftProducts;
