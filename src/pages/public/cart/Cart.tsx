import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { useCart } from "@/components/context/CartContext";
import { selectUser } from "@/components/store/store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import { MdArrowForwardIos } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { removeFromCart, clearCart } = useCart();
  const [cartData, setCartData] = useState<any[]>([]);
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  // Load cart data from localStorage only once
  useEffect(() => {
    const storedCart = localStorage.getItem("addToCart");
    if (storedCart) {
      setCartData(JSON.parse(storedCart));
    }
  }, []);

 
  // Function to update cart data and localStorage together
  const updateCart = (updatedCart: any[]) => {
    setCartData(updatedCart);
    localStorage.setItem("addToCart", JSON.stringify(updatedCart));
  };
  const subtotal = cartData.reduce(
    (acc, item) =>
      acc +
      ((typeof item.originalPrice === "string"
        ? Number(item.originalPrice.replace(/,/g, ""))
        : Number(item.originalPrice)) *
        item.quantity +
        (item?.extraWarrantyPrice || 0) * item.quantity),
    0
  );

  // Handle quantity change
  const handleQuantityChange = (
    productId: number,
    colorId: number,
    delta: number
  ) => {
    const updatedCart = cartData?.map((item) =>
      item.id === productId && item.colorId === colorId
        ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
        : item
    );
    updateCart(updatedCart);
  };

  // Handle delete item
  const handleDelete = (productId: number, colorId: number) => {
    removeFromCart(productId, colorId);
    const updatedCart = cartData.filter(
      (item) => item.id !== productId || item.colorId !== colorId
    );
    updateCart(updatedCart);
  };

  const clearCartHandler = () => {
    clearCart();

    setCartData([]);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <div className="bg-other_bg bg-cover py-16">
        <SectionWrapper className="flex flex-col items-center justify-center">
          <h2 className="text-[24px] font-semibold text-center">CART</h2>
          <h2 className="text-[14px] font-medium flex items-center">
            Home{" "}
            <span className="px-2">
              <MdArrowForwardIos />
            </span>{" "}
            Cart
          </h2>
        </SectionWrapper>
      </div>
      <SectionWrapper>
        <div className="bg-white text-black py-8 px-4">
        

          {/* Cart Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product List */}
            <div className="lg:col-span-2">
              {/* Cart Table */}
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full hidden lg:table text-left table-auto">
                  {/* Table Head */}
                  <thead>
                    <tr className="bg-gray-100 text-[16px] md:text-[18px] leading-[28px] font-bold text-black">
                      <th className="p-4 w-2/5">Product</th>
                      <th className="p-4 w-1/5 text-center">Price</th>
                      <th className="p-4 w-1/5 text-center">Quantity</th>
                      <th className="p-4 w-1/5 text-center">Warranty</th>
                      <th className="p-4 w-1/5 text-center">Subtotal</th>
                      <th className="p-4 w-[5%] text-center">Action</th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody>
                    {cartData.length > 0 ? (
                      cartData.map((item) => (
                        <tr
                          key={item.id}
                          className="border-t text-[14px] md:text-[16px] leading-[24px] text-black font-semibold"
                        >
                          {/* Product Info */}
                          <Link to={`/products/${item?.productLink}`}>
                            <td className="p-4 flex w-[300px] items-center gap-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded mx-auto md:mx-0"
                              />
                              <div className="text-left">
                                <p className="font-bold">{item.title}</p>
                                {/* Display Color Name */}
                                {item.colorName && (
                                  <p className="text-sm text-gray-600">
                                    Color: {item.colorName}
                                  </p>
                                )}
                                {/* Display RAM/ROM if available */}
                                <div>
                                  {item.ramRom && (
                                    <p className="text-sm text-gray-600">
                                      RAM/ROM: {item.ramRom}
                                    </p>
                                  )}
                                  {item.sim && (
                                    <p className="text-sm text-gray-600">
                                      SIM: {item.sim}
                                    </p>
                                  )}
                                  {item.region && (
                                    <p className="text-sm text-gray-600">
                                      Region: {item.region}
                                    </p>
                                  )}
                                  {item.chipset && (
                                    <p className="text-sm text-gray-600">
                                      Chipset: {item.chipset}
                                    </p>
                                  )}
                                  {item.extraWarrantyName && (
                                    <p className="text-sm text-gray-600">
                                      Warranty: {item.extraWarrantyName}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                          </Link>

                          {/* Price */}
                          <td className="p-4 text-center">
                            {item.originalPrice.toLocaleString()} ৳
                          </td>

                          {/* Quantity */}
                          <td className="p-4 text-center">
                            <div className="flex justify-center items-center gap-2">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.colorId,
                                    -1
                                  )
                                }
                                className="border px-2 py-1 rounded hover:bg-gray-200"
                              >
                                -
                              </button>
                              <span className="px-2">{item.quantity}</span>
                              <button
                                disabled={
                                  item?.instock &&
                                  item?.stock &&
                                  item?.stock > 0 &&
                                  item?.stock <= item?.quantity
                                }
                                onClick={() =>
                                  handleQuantityChange(item.id, item.colorId, 1)
                                }
                                className="border px-2 py-1 rounded hover:bg-gray-200"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Warranty Price */}
                          <td className="p-4 text-center font-semibold">
                            {item?.extraWarrantyPrice * item?.quantity || 0} ৳
                          </td>

                          {/* Subtotal */}
                          <td className="p-4 text-center font-semibold">
                            {(
                              (typeof item.originalPrice === "string"
                                ? Number(item.originalPrice.replace(/,/g, ""))
                                : Number(item.originalPrice)) *
                                item.quantity +
                              (item?.extraWarrantyPrice || 0) * item.quantity
                            ).toLocaleString("en-IN")}{" "}
                            ৳
                          </td>

                          {/* Action */}
                          <td className="p-4 text-center align-middle">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button className="bg-white text-red-600 px-4 py-2 rounded flex items-center gap-2 ml-2">
                                  <FiTrash2 />
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove this
                                    variation from the cart?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="btn-destructive-fill">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDelete(item.id, item.colorId)
                                    }
                                  >
                                    Confirm
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-8 text-gray-500"
                        >
                          Your cart is empty!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {/* Mobile Cards (shown on sm and smaller screens) */}
                <div className="md:hidden space-y-4 p-2">
                  {cartData.length > 0 ? (
                    cartData.map((item) => (
                      <div
                        key={item.id}
                      >
                        {/* Product Info */}
                        <div className="flex items-start gap-4 mb-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-bold">{item.title}</p>
                            {item.colorName && (
                              <p className="text-sm text-gray-600">
                                Color: {item.colorName}
                              </p>
                            )}
                            {item.ramRom && (
                              <p className="text-sm text-gray-600">
                                RAM/ROM: {item.ramRom}
                              </p>
                            )}
                            {item.sim && (
                              <p className="text-sm text-gray-600">
                                SIM: {item.sim}
                              </p>
                            )}
                            {item.region && (
                              <p className="text-sm text-gray-600">
                                Region: {item.region}
                              </p>
                            )}
                            {item.chipset && (
                              <p className="text-sm text-gray-600">
                                Chipset: {item.chipset}
                              </p>
                            )}
                            {item.extraWarrantyName && (
                              <p className="text-sm text-gray-600">
                                Warranty: {item.extraWarrantyName}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.colorId, -1)
                              }
                              className="border px-3 py-1 rounded hover:bg-gray-200"
                            >
                              -
                            </button>
                            <span className="py-1 bg-gray-100 px-3">{item.quantity}</span>
                            <button
                              disabled={
                                item?.instock &&
                                item?.stock &&
                                item?.stock > 0 &&
                                item?.stock <= item?.quantity
                              }
                              onClick={() =>
                                handleQuantityChange(item.id, item.colorId, 1)
                              }
                              className="border px-3 py-1 rounded hover:bg-gray-200"
                            >
                              +
                            </button>
                          </div>
                          <div>
                            <p className="font-semibold">
                              {(
                                (typeof item.originalPrice === "string"
                                  ? Number(item.originalPrice.replace(/,/g, ""))
                                  : Number(item.originalPrice)) *
                                  item.quantity +
                                (item?.extraWarrantyPrice || 0) * item.quantity
                              ).toLocaleString("en-IN")}{" "}
                              ৳
                            </p>
                          </div>
                          {/* Action Button */}
                          <div className="flex justify-end">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button className="bg-white text-red-600 px-2 py-1 rounded flex items-center gap-1 border border-red-200 hover:bg-red-50">
                                  <FiTrash2 /> Remove
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove this item
                                    from the cart?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="btn-destructive-fill">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDelete(item.id, item.colorId)
                                    }
                                  >
                                    Confirm
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Your cart is empty!
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size={"sm"} className="h-7 lg:h-9">Clear Cart</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove all the variation from
                        the cart?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="btn-destructive-fill">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={clearCartHandler}>
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Cart Totals */}
            <div className="border rounded-lg">
              <h2 className="text-lg font-bold my-4 px-4 text-center md:text-left">
                YOUR ORDER
              </h2>
              <div className="bg-[#F7F0FF]/50 p-4 space-y-4">
                {/* Product Names and Subtotals */}
                <div className="space-y-2">
                  {cartData.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm font-semibold"
                    >
                      <span className="max-w-60">{item.title}</span>
                      <span>
                        {(
                          (typeof item.originalPrice === "string"
                            ? Number(item.originalPrice.replace(/,/g, ""))
                            : Number(item.originalPrice)) *
                            item.quantity +
                          (item?.extraWarrantyPrice || 0) * item.quantity
                        ).toLocaleString("en-IN")}{" "}
                        ৳
                      </span>
                    </div>
                  ))}
                </div>
                <hr />
                <div className="flex justify-between">
                  <p className="font-bold">Subtotal</p>
                  <p className="font-semibold">{subtotal.toLocaleString()} ৳</p>
                </div>
                <hr />{" "}
                <Button
                  disabled={!cartData?.length}
                  size={"large"}
                  variant={"default"}
                  className="px-0 py-0"
                  onClick={() => {
                    if (!user?.email) {
                      navigate("/login");
                    } else {
                      navigate("/checkout");
                    }
                  }}
                >
                  <span className="px-16 md:px-28 py-3">
                    PROCEED TO CHECKOUT
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default Cart;
