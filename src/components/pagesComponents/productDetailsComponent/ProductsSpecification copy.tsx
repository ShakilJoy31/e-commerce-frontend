import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import StockWithButton from "./StockWIthButton";
// import ReactImageMagnify from "react-image-magnify";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { CiCreditCard2 } from "react-icons/ci";
import { AiOutlineGift } from "react-icons/ai";
import { DiGitCompare } from "react-icons/di";
import { RiExchangeDollarFill } from "react-icons/ri";
import DOMPurify from "dompurify";
import {
  FacebookShareButton,
  WhatsappShareButton,
  FacebookIcon,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
} from "react-share";
import { ClipboardCopyIcon } from "lucide-react";
import { PiShareFat } from "react-icons/pi";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/pagination";

// import required modules
import { Pagination, Mousewheel } from "swiper/modules";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useWishList } from "@/components/context/WishListContext";
import { toast } from "@/components/ui/use-toast";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import { FaHeart, FaWhatsapp } from "react-icons/fa";
import EmiAvailable from "./EmiAvailable";
import HighLightProduct from "./HighLightProduct";
import { useGetEmisQuery } from "@/components/store/api/emi/emiApi";
import { useGetBanksQuery } from "@/components/store/api/emi/bankApi";
import { BsTruck } from "react-icons/bs";
import ExchangePolicy from "@/components/common/policy/ExchangePolicy";
import { useSelector } from "react-redux";
import { selectUser } from "@/components/store/store";
import { Link } from "react-router-dom";

export default function ProductsSpecification({ details }: any) {
  const [wishIsSuccess, setWishIsSuccess] = useState(false);
  const { addToWish, isProductInWishList } = useWishList();
  const user = useSelector(selectUser);
  const sanitizedDescription = DOMPurify.sanitize(
    details?.data?.sortDescription
  );

  const filteredContent = sanitizedDescription
    .replace(/<h1>/g, '<h1 class="text-2xl font-bold mb-2">')
    .replace(/<\/h1>/g, "</h1>")
    .replace(/<h2>/g, '<h2 class="text-xl font-semibold mb-2">')
    .replace(/<\/h2>/g, "</h2>")
    .replace(/<h3>/g, '<h3 class="text-lg font-semibold mb-2">')
    .replace(/<\/h3>/g, "</h3>")
    .replace(/<h4>/g, '<h4 class="text-base font-semibold mb-2">')
    .replace(/<\/h4>/g, "</h4>")
    .replace(/<p>/g, '<p class="mb-4 text-base leading-relaxed">')
    .replace(/<\/p>/g, "</p>")
    .replace(/<ul>/g, '<ul class="list-disc pl-5">')
    .replace(/<\/ul>/g, "</ul>")
    .replace(/<ol>/g, '<ol class="list-decimal pl-5">')
    .replace(/<\/ol>/g, "</ol>");
  // console.log(details?.data);
  // Generate the product URL dynamically
  const productUrl = `https://kryinternational.com/products/${
    details?.data?.productLink || ""
  }`;

  const [selectedImage, setSelectedImage] = useState("");

  const [quantity, setQuantity] = useState<number>(0);

  const handleImageClick = (imageUrl: string, colorId: number) => {
    setSelectedImage(imageUrl);
    setSelectedColor(colorId);

    // Find the color name from the filteredColors list
    const selectedColorObj = filteredColors.find(
      (color) => color.colorId === colorId
    );

    if (selectedColorObj) {
      setColorName(selectedColorObj.color.color);
      setChooseColor(selectedColorObj?.id);
    }
  };

  const [inStock, setInStock] = useState<boolean>(true);
  const defaultVariation = details?.data?.VariationProduct?.[0] || null;

  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [chooseColor, setChooseColor] = useState<number | null>(null);
  const [colorName, setColorName] = useState<string>("");
  const [selectedRamRom, setSelectedRamRom] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  // const [choosedRamRom, setChoosedRamRom] = useState<string | null>(null);
  const [choosedVariationId, setChoosedVariationId] = useState<number | null>(
    null
  );
  const [selectedSim, setSelectedSim] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedChipset, setSelectedChipset] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  // const [isPriceAvailable, setIsPriceAvailable] = useState<boolean>(true);
  const [selectedDiscountPrice, setSelectedDiscountPrice] = useState<
    number | null
  >(null);
  const [selectedBookingPrice, setSelectedBookingPrice] = useState<
    number | null
  >(null);
  const [selectedPurchasePoint, setSelectedPurchasePoint] = useState<
    number | null
  >(null);
  const [selectedExtraWarranty, setSelectedExtraWarranty] = useState<any[]>([]);
  const [selectedExtraWarrantyPrice, setSelectedExtraWarrantyPrice] = useState<
    number | null
  >(null);
  const [selectedExtraWarrantyName, setSelectedExtraWarrantyName] = useState<
    string | null
  >(null);
  const [selectedExtraWarrantyId, setSelectedExtraWarrantyId] = useState<
    number | null
  >(null);
  const [filteredColors, setFilteredColors] = useState<any[]>([]);

  useEffect(() => {
    if (details?.data) {
      const defaultVariation = details?.data?.VariationProduct?.[0] || null;

      setSelectedImage(details?.data?.ProductImage?.[0]?.imageUrl || "");

      if (defaultVariation) {
        setSelectedColor(
          defaultVariation?.ProductColor?.[0]?.color?.id || null
        );
        setChooseColor(defaultVariation?.ProductColor?.[0]?.id || null);

        setColorName(defaultVariation?.ProductColor?.[0]?.color?.color || "");
        setSelectedRamRom(
          defaultVariation?.ram || defaultVariation?.rom
            ? `${defaultVariation.ram ?? ""}/${defaultVariation.rom ?? ""}`
            : null
        );
        setSelectedSize(defaultVariation?.size);
        setChoosedVariationId(defaultVariation?.id);
        setSelectedSim(defaultVariation?.sim ?? null);
        setSelectedRegion(defaultVariation?.region ?? null);
        setSelectedChipset(defaultVariation?.chipset ?? null);
        setSelectedPrice(defaultVariation?.price ?? null);
        setSelectedDiscountPrice(defaultVariation?.discountPrice ?? null);
        setSelectedBookingPrice(defaultVariation?.bookingPrice ?? null);
        setSelectedPurchasePoint(defaultVariation?.purchasePoint ?? null);
        setSelectedExtraWarranty(defaultVariation?.ExtraWarranty ?? []);
        setFilteredColors(defaultVariation?.ProductColor || []);
      }
    }
  }, [details]);

  const handleWarrantySelect = (warrantyId: number, price: number, name:string) => {
    if (selectedExtraWarrantyId === warrantyId) {
      // Deselect if the same warranty is clicked again
      setSelectedExtraWarrantyId(null);
      setSelectedExtraWarrantyPrice(null);
      setSelectedExtraWarrantyName(null)
    } else {
      // Select a new warranty and update price
      setSelectedExtraWarrantyId(warrantyId);
      setSelectedExtraWarrantyPrice(price);
      setSelectedExtraWarrantyName(name)
    }
  };

  // Calculate final price (discountPrice + selected warranty price)
  // Calculate final price based on selected payment method

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("cash");

  const finalPrice =
    ((selectedPrice ?? 0) -
      (selectedDiscountPrice ?? 0) +
      (selectedExtraWarrantyPrice ?? 0)) *
    quantity;
  const [filteredImages, setFilteredImages] = useState<any[]>([]);

  useEffect(() => {
    let images: any[] = [];

    if (selectedRamRom) {
      const [ram, rom] = selectedRamRom.split("/");
      const selectedColors =
        details?.colors?.find((item) => item.ram === ram && item.rom === rom)
          ?.colors || [];

      images = details?.data?.ProductImage?.filter((image) =>
        selectedColors.some((color) => color.colorId === image.colorId)
      );
    }

    // ✅ **If no RAM/ROM selected, show all available colors' images**
    if (!selectedRamRom || images.length === 0) {
      const availableColors =
        details?.colors?.flatMap((item) => item.colors) || [];

      images = details?.data?.ProductImage?.filter((image) =>
        availableColors.some((color) => color.colorId === image.colorId)
      );
    }

    // ✅ **Fallback: If still no images found, show all product images**
    if (images.length === 0) {
      images = details?.data?.ProductImage || [];
    }

    setFilteredImages(images);
  }, [selectedRamRom, details]);
  useEffect(() => {
    let stockAvailable = false;
  
    if (selectedColor) {
      // Find the selected color in the product data
      const selectedColorObj = details?.colors
        ?.flatMap((item) => item.colors)
        ?.find((color) => color.colorId === selectedColor);
  
      // ✅ If the selected color exists, check its stock status
      if (selectedColorObj) {
        stockAvailable = selectedColorObj.inStock;
      }
    }
  
    // ✅ If no specific color is selected, check if any color is in stock
    if (!selectedColor) {
      const allColors = details?.colors?.flatMap((item) => item.colors) || [];
  
      // ✅ If **all colors** are `inStock: false`, set `false`, otherwise `true`
      stockAvailable = allColors.some((color) => color.inStock);
    }
  
    // ✅ Set the final stock availability
    setInStock(stockAvailable);
  }, [selectedColor, details]);
  


  const handleRamRomSelect = (ram: string, rom: string) => {
    const selectedRamRomStr = `${ram}/${rom}`;
    setSelectedRamRom(selectedRamRomStr);
    // setChoosedRamRom(selectedRamRomStr);

    // Find related colors
    const selectedColors =
      details?.colors?.find((item) => item.ram === ram && item.rom === rom)
        ?.colors || [];
    setFilteredColors(selectedColors);

    if (selectedColors.length > 0) {
      setSelectedColor(selectedColors[0].colorId);
      setColorName(selectedColors[0].color.color);
    } else {
      setSelectedColor(null);
      setColorName("");
    }

    // Find related SIM
    const selectedSimType =
      details?.sim?.find((item) => item.ram === ram && item.rom === rom)
        ?.sim[0] || null;
    setSelectedSim(selectedSimType);

    // Find related Region
    const selectedRegionValue =
      details?.regions?.find((item) => item.ram === ram && item.rom === rom)
        ?.region[0] || null;
    setSelectedRegion(selectedRegionValue);

    // Find related Chipset
    const selectedChipsetValue =
      details?.chipset?.find((item) => item.ram === ram && item.rom === rom)
        ?.chipset[0] || null;
    setSelectedChipset(selectedChipsetValue);

    // Find related Price
    const selectedVariation = details?.data?.VariationProduct?.find(
      (variation) => variation.ram === ram && variation.rom === rom
    );

    if (selectedVariation) {
      setSelectedPrice(selectedVariation.price);
      setSelectedDiscountPrice(selectedVariation.discountPrice);
      setSelectedBookingPrice(selectedVariation.bookingPrice);
      setSelectedPurchasePoint(selectedVariation.purchasePoint);
      setSelectedExtraWarranty(selectedVariation.ExtraWarranty || []);
    } else {
      setSelectedPrice(null);
      setSelectedDiscountPrice(null);
      setSelectedBookingPrice(null);
      setSelectedPurchasePoint(null);
      setSelectedExtraWarranty([]);
    }
  };
  useEffect(() => {
    if (details?.data) {
      setSelectedImage(details?.data?.ProductImage?.[0]?.imageUrl || "");

      // Select default variation
      // const defaultVariation = details?.data?.VariationProduct?.[0] || null;
      // if (defaultVariation) {
      //   handleRamRomSelect(defaultVariation.ram, defaultVariation.rom);
      // }
    }
  }, [details]);

  const handleSelectionChange = (type: string, value: string) => {
    let tempSim = selectedSim;
    let tempRegion = selectedRegion;
    let tempChipset = selectedChipset;
  
    // Update the selected type (SIM, Region, or Chipset)
    if (type === "sim") {
      tempSim = value;
      setSelectedSim(value);
  
      // Auto-update region and chipset based on selected SIM
      const matchingVariation = details?.data?.VariationProduct?.find(
        (variation) =>
          variation.sim === value &&
          `${variation?.ram}/${variation?.rom}` === selectedRamRom
      );
  
      if (matchingVariation) {
        tempRegion = matchingVariation.region;
        tempChipset = matchingVariation.chipset;
  
        setSelectedRegion(matchingVariation.region);
        setSelectedChipset(matchingVariation.chipset);
      }
    } else if (type === "region") {
      tempRegion = value;
      setSelectedRegion(value);
  
      // Auto-select SIM and chipset from the same variation if available
      const matchingVariation = details?.data?.VariationProduct?.find(
        (variation) =>
          variation.region === value &&
          variation.chipset === tempChipset &&
          `${variation?.ram}/${variation?.rom}` === selectedRamRom
      );
  
      if (matchingVariation) {
        tempSim = matchingVariation.sim;
        setSelectedSim(matchingVariation.sim);
        tempChipset = matchingVariation.chipset;
        setSelectedChipset(matchingVariation.chipset);
      }
    } else if (type === "chipset") {
      tempChipset = value;
      setSelectedChipset(value);
  
      // Auto-select SIM and region from the same variation if available
      const matchingVariation = details?.data?.VariationProduct?.find(
        (variation) =>
          variation.chipset === value &&
          variation.region === tempRegion &&
          `${variation?.ram}/${variation?.rom}` === selectedRamRom
      );
  
      if (matchingVariation) {
        tempSim = matchingVariation.sim;
        setSelectedSim(matchingVariation.sim);
        tempRegion = matchingVariation.region;
        setSelectedRegion(matchingVariation.region);
      }
    }
  
    // ✅ Find the correct variation after ensuring all state updates
    const selectedVariation = details?.data?.VariationProduct?.find(
      (variation) =>
        variation.sim === tempSim &&
        variation.region === tempRegion &&
        variation.chipset === tempChipset &&
        `${variation?.ram}/${variation?.rom}` === selectedRamRom
    );
  
    // ✅ Update price and other info based on the selected combination
    if (selectedVariation) {
      setSelectedPrice(selectedVariation.price);
      setSelectedDiscountPrice(selectedVariation.discountPrice);
      setSelectedBookingPrice(selectedVariation.bookingPrice);
      setSelectedPurchasePoint(selectedVariation.purchasePoint);
      setSelectedExtraWarranty(selectedVariation.ExtraWarranty || []);
      setChoosedVariationId(selectedVariation.id);
    }
  };
  
  

  const handleWishList = () => {
    const product = {
      id: details?.data?.id,
      image: details?.data?.ProductImage?.[0]?.imageUrl,
      title: details?.data?.productName,
      discountPrice: finalPrice,
      originalPrice: defaultVariation ? defaultVariation.price : 0,
      stock: inStock ? true : false,
      colorId: selectedColor,
      time: new Date().toLocaleString(),
    };
    addToWish(product);
    setWishIsSuccess(true);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(productUrl);
    toast({
      title: "Copy Link",
      description: "Link copied to clipboard!",
    });
  };

  useEffect(() => {
    if (wishIsSuccess) {
      toast({
        title: "Add to wish list",
        description: toastMessageGenerator("add", details?.data?.productName),
      });
      setWishIsSuccess(false);
    }
  }, [wishIsSuccess, details?.data?.productName]);

  const message = "Hello, I'm interested in this product!";

  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    handleResize();

    // Event listener for resize
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // SHOWING LOWEST EMI PLAN

  const { data: bankEmis } = useGetEmisQuery({});
  const { data: banks } = useGetBanksQuery({});

  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [lowestEmi, setLowestEmi] = useState<number | null>(null);
  const [lowestEffectiveCost, setLowestEffectiveCost] = useState<number | null>(
    null
  );
  const [lowestEmiMonth, setLowestEmiMonth] = useState<number | null>(null);

  // Set the first bank as the default selected bank when banks data is available
  useEffect(() => {
    if (banks?.data?.length && !selectedBank) {
      setSelectedBank(banks.data[0].name);
    }
  }, [banks, selectedBank]);

  // Calculate the lowest effective cost for the first bank's lowest month EMI plan
  useEffect(() => {
    if (
      bankEmis &&
      banks &&
      selectedPrice !== null &&
      selectedDiscountPrice !== null &&
      selectedBank
    ) {
      let minEffectiveCost = Infinity;
      let minEmi = Infinity;
      let minMonth = null;

      // Calculate the actual discounted price
      const actualDiscountedPrice = selectedPrice - selectedDiscountPrice;

      const selectedBankData = banks.data.find(
        (bank: any) => bank.name === selectedBank
      );

      if (selectedBankData) {
        const emiPlans = bankEmis.data.filter(
          (emi: any) => emi.bankId === selectedBankData.id
        );

        // Sort EMI plans by month (ascending order)
        emiPlans.sort((a, b) => a.month - b.month);

        if (emiPlans.length > 0) {
          const firstPlan = emiPlans[0];
          minEffectiveCost =
            actualDiscountedPrice +
            (actualDiscountedPrice * firstPlan.charge) / 100;
          minEmi = minEffectiveCost / firstPlan.month;
          minMonth = firstPlan.month;
        }
      }

      setLowestEmi(minEmi !== Infinity ? minEmi : null);
      setLowestEffectiveCost(
        minEffectiveCost !== Infinity ? minEffectiveCost : null
      );
      setLowestEmiMonth(minMonth);
    }
  }, [bankEmis, banks, selectedPrice, selectedDiscountPrice, selectedBank]);

  useEffect(() => {
    if (defaultVariation) {
      setSelectedSim(defaultVariation.sim ?? null);
      setSelectedRegion(defaultVariation.region ?? null);
      setSelectedChipset(defaultVariation.chipset ?? null);
    }
  }, [defaultVariation]);

  return (
    <SectionWrapper>
      <div className="grid grid-cols-12 gap-5 py-5">
        {/* Product Images */}
        <div className="col-span-12 lg:col-span-6 relative">
          <div className="sticky top-20 self-start">
            <div className="grid grid-cols-12">
              <div className="col-span-12 lg:col-span-3 flex gap-2 flex-col justify-top items-center order-last lg:order-first">
                <Swiper
                  direction={isMobile ? "horizontal" : "vertical"}
                  slidesPerView={4}
                  spaceBetween={10}
                  mousewheel={true}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Mousewheel, Pagination]}
                  className="mySwiper w-full h-[100px] lg:h-[400px] p-5"
                >
                  {details?.data?.ProductImage?.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        className={`w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] p-2 bg-[#C6C6C6/200] shadow-lg rounded-sm cursor-pointer ${
                          selectedImage === image?.imageUrl
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        src={image?.imageUrl}
                        alt={`Product Image ${index + 1}`}
                        onClick={() =>
                          handleImageClick(image?.imageUrl, image?.colorId)
                        }
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="col-span-12 lg:col-span-9 relative">
                {/* Wishlist and Share Buttons */}
                <div className="absolute z-20 top-2 right-2 flex items-center gap-3 p-2 rounded-lg">
                  {/* Wishlist Icon */}
                  <span>
                    <FaHeart
                      onClick={handleWishList}
                      className={`text-gray-400 w-5 h-5 cursor-pointer text-lg ${
                        isProductInWishList(details?.data?.id)
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </span>
                </div>

                {/* Product Image with Image Tag */}
                <div className="relative bg-white shadow-lg rounded-lg p-3 w-full h-[250px] lg:h-[450px]">
                  <img
                    src={selectedImage}
                    alt="Selected Product"
                    className="w-full h-full object-contain bg-center rounded-lg"
                  />
                  {/* Sale Badge */}
                  {details?.data?.discountPrice && (
                    <div className="absolute top-4 left-4">
                      <h3 className="text-sm font-semibold bg-red-500 px-2 py-0.5 text-white rounded-full">
                        Sale
                      </h3>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product details?.data */}
        <div className="col-span-12 lg:col-span-6">
          <div className="bg-[#FFF] rounded-lg px-5 py-3 shadow-md">
            <div className="flex justify-between items-start">
              <h2 className="font-bold text-xl lg:text-2xl text-black">
                {details?.data?.productName}
              </h2>
              <div className="flex items-center gap-4">
                {user?.role.toLowerCase() === "admin" && (
                  <Link
                    to={`/kry-admin-portal/edit-product/${details?.data?.productLink}`}
                    className="border bg-primary rounded-md"
                  >
                    <span className=" px-3 py-2 text-white">Edit</span>
                  </Link>
                )}

                {/* Share Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <span className="text-sm cursor-pointer mt-1.5 font-semibold text-primary flex items-center">
                      <PiShareFat className="" size={25} />
                    </span>
                  </DialogTrigger>
                  <DialogContent className="p-6 rounded-lg shadow-lg">
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Share this link via
                    </h3>

                    {/* Social Share Buttons */}
                    <div className="flex gap-4 mb-6">
                      {/* Facebook Share */}
                      <FacebookShareButton
                        url={productUrl}
                        title={`Check out this amazing product: ${details?.data?.productLink}`}
                      >
                        <FacebookIcon size={40} round />
                      </FacebookShareButton>
                      <FacebookMessengerShareButton
                        appId={"abc"}
                        url={productUrl}
                        title={`Check out this amazing product: ${details?.data?.productLink}`}
                      >
                        <FacebookMessengerIcon size={40} round />
                      </FacebookMessengerShareButton>

                      {/* WhatsApp Share */}
                      <WhatsappShareButton
                        url={productUrl}
                        title={`Check out this amazing product: ${details?.data?.productLink}`}
                      >
                        <WhatsappIcon size={40} round />
                      </WhatsappShareButton>

                      {/* Twitter Share (Optional) */}
                      <TwitterShareButton
                        url={productUrl}
                        title={`Check out this amazing product: ${details?.data?.productLink}`}
                      >
                        <TwitterIcon size={40} round />
                      </TwitterShareButton>

                      {/* LinkedIn Share (Optional) */}
                      <LinkedinShareButton
                        url={productUrl}
                        title={details?.data?.productLink}
                        summary={details?.data?.description}
                      >
                        <LinkedinIcon size={40} round />
                      </LinkedinShareButton>
                    </div>

                    {/* Copy Link Section */}
                    <div>
                      <p className="text-gray-600 mb-2">Or copy link</p>
                      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                        <input
                          type="text"
                          readOnly
                          value={productUrl}
                          className="flex-grow px-3 py-2 text-gray-700 bg-gray-100 focus:outline-none"
                        />
                        <button
                          onClick={handleCopy}
                          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 text-gray-700 flex items-center"
                        >
                          <ClipboardCopyIcon className="w-4 h-4 mr-1" /> Copy
                        </button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            {details?.data?.sortDescription && (
              <div className="prose prose-headings:font-bold prose-ul:list-disc prose-ol:list-decimal max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: filteredContent }}
                  className="w-full [&_img]:w-full [&_img]:h-auto"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-3 items-center justify-between w-full my-5">
              <h2 className="text-sm items-center lg:text-sm font-bold text-start">
                Status:{" "}
                {inStock ? (
                  <span className="bg-primary text-white px-4 py-0.5 rounded-full">
                    In Stock
                  </span>
                ) : (
                  <span className="bg-red-600 text-white px-4 py-0.5 rounded-full">
                    Stock Out
                  </span>
                )}
              </h2>
              <p className="border rounded-full px-4 py-0.5 bg-gray-100 flex justify-center gap-2">
                <span className="border-black text-primary animate-pulse text-xs lg:text-sm font-bold">
                  {details?.data?.highlightText}
                </span>{" "}
              </p>

              <div>
                <a
                  href={`https://wa.me/${
                    details?.data?.whatsAppNumber
                  }?text=${encodeURIComponent(message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-0.5 rounded-lg shadow-md hover:from-green-500 hover:to-green-700 transition"
                >
                  <FaWhatsapp className="text-xl" />
                  <span className="flex flex-col text-xs lg:text-[14px]">
                    WhatsApp
                  </span>
                </a>
              </div>

              <p className="border rounded-full px-3 py-0.5 bg-gray-100 flex items-center justify-center gap-1">
                <DiGitCompare size={20} />
                <span className="border-black text-xs lg:text-sm font-semibold">
                  Add To Compare
                </span>{" "}
              </p>
            </div>

            {/* <div className="prose prose-headings:font-bold prose-ul:list-disc prose-ol:list-decimal max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: filteredContent }}
                className="w-full [&_img]:w-full [&_img]:h-auto"
              />
            </div> */}
            {/* PRICE AND POLICY */}
            <div className="flex flex-wrap gap-y-3 items-center justify-between py-3">
              <>
                {" "}
                <div className="flex items-center gap-1.5">
                  {" "}
                  <h2 className="flex items-center gap-2 text-primary">
                    <span className="font-bold text-2xl">TK.</span>
                    <span className="font-bold text-2xl">
                      {selectedPrice
                        ? (
                            selectedPrice - (selectedDiscountPrice ?? 0)
                          ).toLocaleString("en-IN")
                        : "0"}
                    </span>
                  </h2>
                  {selectedDiscountPrice !== 0 && (
                    <div className="flex justify-end items-center gap-1 text-gray-500">
                      <h2 className="text-sm line-through flex items-center justify-end gap-1">
                        <span className="text-lg">
                          TK. {selectedPrice?.toLocaleString("en-IN")}
                        </span>
                      </h2>
                    </div>
                  )}
                </div>
              </>

              <Dialog>
                <DialogTrigger asChild>
                  <p className="border rounded-full cursor-pointer px-3 py-0.5 bg-gray-100 flex items-center justify-center gap-1">
                    <RiExchangeDollarFill size={20} />
                    <span className="border-black text-xs lg:text-sm font-semibold">
                      Exchange Policy
                    </span>{" "}
                  </p>
                </DialogTrigger>
                <DialogContent className="p-6 rounded-lg sm:min-w-[1000px] shadow-lg max-h-[80vh] overflow-y-auto custom-scroll">
                  <ExchangePolicy />
                </DialogContent>
              </Dialog>
            </div>

            {/* COLOR TAB */}
            <div className="py-3">
              {/* Color Selection - Only show if colors exist */}
              {filteredImages?.length > 0 && (
                <div className="w-full">
                  <h2 className="text-base  mb-2">
                    <span className="font-semibold">Color</span>: {colorName}
                  </h2>
                  <div className="flex gap-4 flex-wrap">
                    {filteredImages?.map((image) => {
                      const colorObj = details?.colors
                        .flatMap((item) => item.colors)
                        .find((color) => color.colorId === image.colorId);

                      return (
                        <div
                          key={image.colorId}
                          className={`w-8 h-8 lg:w-12 lg:h-12 p-0.5 rounded-full border-2 flex items-center justify-center overflow-hidden ${
                            selectedColor === image.colorId
                              ? "border-primary"
                              : "border-gray-300"
                          } cursor-pointer`}
                          onClick={() =>
                            handleImageClick(image.imageUrl, image.colorId)
                          }
                        >
                          <img
                            src={image.imageUrl}
                            alt={colorObj?.color?.color || "Unknown"}
                            className="w-full h-full object-contain rounded-full"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* RAM & Storage Selection - Only show if RAM/ROM exists */}
              {details?.variations?.length > 0 && (
                <>
                  <div className="w-full flex flex-col gap-2 mt-5">
                    <h2 className="font-bold text-sm">Ram & Storage:</h2>
                    <div className="flex items-center flex-wrap gap-2">
                      {details?.variations?.map((variation) => (
                        <button
                          key={variation.id}
                          onClick={() =>
                            handleRamRomSelect(variation.ram, variation.rom)
                          }
                          className={`px-3 py-1 border rounded-full text-sm font-semibold ${
                            selectedRamRom ===
                            `${variation.ram}/${variation.rom}`
                              ? "border-primary"
                              : "border-gray-300"
                          }`}
                        >
                          {variation.ram}/{variation.rom}GB
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 lg:gap-10 items-center pt-7">
                {details?.data?.vendor && (
                  <h3 className="text-sm items-center lg:text-sm font-bold text-start">
                    Vendor:{" "}
                    <span className="border px-4 py-0.5 rounded-full">
                      {details?.data?.vendor?.name}
                    </span>
                  </h3>
                )}
                {selectedSize && (
                  <h3 className="text-sm items-center lg:text-sm font-bold text-start">
                    Size:{" "}
                    <span className="border px-4 py-0.5 rounded-full">
                      {selectedSize}
                    </span>
                  </h3>
                )}
              </div>
              {/* SIM REGION CHIPSET */}
              {(details?.regions?.length > 0 ||
                details?.sim.length > 0 ||
                details?.chipset?.length > 0) && (
                <div className="flex flex-wrap gap-3 lg:gap-7 items-center pt-5">
                  {/* SIM Dropdown */}
                  {details?.sim?.length > 0 && (
                    <div className="flex items-center gap-1">
                      <label className="font-bold text-sm">SIM:</label>
                      <select
                        className="border px-2 py-0.5 rounded-full w-24"
                        value={selectedSim ?? ""}
                        onChange={(e) =>
                          handleSelectionChange("sim", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {details?.sim
                          ?.filter(
                            (item) =>
                              item.ram === selectedRamRom?.split("/")[0] &&
                              item.rom === selectedRamRom?.split("/")[1]
                          )
                          .flatMap((item) => item.sim)
                          .map((simType, index) => (
                            <option key={index} value={simType}>
                              {simType}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  {/* Region Dropdown */}
                  {details?.regions?.length > 0 && (
                    <div className="flex items-center gap-1">
                      <label className="font-bold text-sm">Region:</label>
                      <select
                        className="border px-2 py-0.5 rounded-full w-28"
                        value={selectedRegion ?? ""}
                        onChange={(e) =>
                          handleSelectionChange("region", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {details?.regions
                          ?.filter(
                            (item) =>
                              item.ram === selectedRamRom?.split("/")[0] &&
                              item.rom === selectedRamRom?.split("/")[1]
                          )
                          .flatMap((item) => item.region)
                          .map((region, index) => (
                            <option key={index} value={region}>
                              {region}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  {/* Chipset Dropdown */}
                  {details?.chipset?.length > 0 && (
                    <div className="flex items-center gap-1">
                      <label className="font-bold text-sm">Chipset:</label>
                      <select
                        className="border px-2 py-0.5  rounded-full w-28"
                        value={selectedChipset ?? ""}
                        onChange={(e) =>
                          handleSelectionChange("chipset", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {details?.chipset
                          ?.filter(
                            (item) =>
                              item.ram === selectedRamRom?.split("/")[0] &&
                              item.rom === selectedRamRom?.split("/")[1]
                          )
                          .flatMap((item) => item.chipset)
                          .map((chipset, index) => (
                            <option
                              key={index}
                              value={chipset}
                              className="text-sm font-bold"
                            >
                              {chipset}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* EMI PRICE AND OFFER PRICE */}
              {details?.data?.isEmi && (
                <div className="flex flex-col mt-7 md:flex-row justify-center items-center gap-6 w-full">
                  {/* Cash/Card/MFS Payment Option */}
                  <label className="flex items-center gap-3 p-3 w-full border rounded-lg border-[#C5D6E5] cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="w-4 h-4 accent-primary"
                      value="cash"
                      checked={selectedPaymentMethod === "cash"}
                      onChange={() => setSelectedPaymentMethod("cash")}
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <h3 className="text-sm font-bold">Offer Price:</h3>
                        <p className="text-sm font-semibold">
                          TK.{" "}
                          {(
                            (selectedPrice ?? 0) - (selectedDiscountPrice ?? 0)
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <span className="font-thin text-xs">
                        Cash/Card/MFS Payment
                      </span>
                    </div>
                  </label>

                  {/* EMI Payment Option */}
                  <label className="flex items-center w-full gap-3 py-1 px-3 border rounded-lg border-[#C5D6E5] cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="w-4 h-4 accent-primary"
                      value="emi"
                      checked={selectedPaymentMethod === "emi"}
                      onChange={() => setSelectedPaymentMethod("emi")}
                    />
                    <div>
                      <div className="flex justify-end">
                        {/* EMI POLICY */}
                        <button disabled={!details?.data?.isEmi}>
                          <Dialog>
                            <DialogTrigger asChild>
                              <div className="cursor-pointer">
                                {/* <span className="font-thin text-xs">
                                  {details?.data?.isEmi
                                    ? "EMI Available"
                                    : "EMI Not Available"}
                                </span> */}
                                <p className="text-xs text-primary text-start font-semibold">
                                  EMI Policy
                                </p>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="p-6 rounded-lg max-w-[600px] shadow-lg">
                              <EmiAvailable
                                price={
                                  (selectedPrice ?? 0) -
                                  (selectedDiscountPrice ?? 0)
                                }
                              />
                            </DialogContent>
                          </Dialog>
                        </button>
                      </div>
                      <div className="flex justify-between items-center gap-5 w-full">
                        <div className="flex items-center gap-1">
                          <h3 className="text-sm font-bold">EMI Price:</h3>
                          <p className="text-sm font-semibold">
                            TK.{" "}
                            {lowestEffectiveCost
                              ? lowestEffectiveCost.toLocaleString("en-IN")
                              : "0"}{" "}
                            <span className="text-xs font-normal">
                              ({lowestEmiMonth ?? "-"} months)
                            </span>
                          </p>
                        </div>
                      </div>
                      <span className="font-thin text-xs">
                        EMI begin at TK {lowestEmi ? lowestEmi.toFixed(0) : "0"}{" "}
                        per month
                      </span>
                    </div>
                  </label>
                </div>
              )}

              {/* EXTRA WARRANTY PART */}
              <div className="mt-5">
                {selectedExtraWarranty?.length > 0 && (
                  <div className="flex gap-3 items-center pb-2">
                    <span className="text-lg font-semibold">Kry Fix:</span>
                  </div>
                )}

                {/* Flex Container to Make Both Sections Equal in Size */}
                <div className="flex flex-col md:flex-row gap-5">
                  {/* Warranty Selection Box */}
                  {selectedExtraWarranty?.length > 0 && (
                    <div className="flex-1 flex flex-col border p-4 rounded-md border-[#C5D6E5] min-h-[150px]">
                      <div className="border rounded-lg flex-1">
                        {selectedExtraWarranty?.map((warranty, index) => (
                          <label
                            key={warranty.id || index}
                            className={`flex items-center justify-between p-3 ${
                              index !== selectedExtraWarranty.length - 1
                                ? "border-b"
                                : ""
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="warranty"
                                className="w-4 h-4 accent-primary"
                                checked={
                                  selectedExtraWarrantyId === warranty.id
                                }
                                onChange={() =>
                                  handleWarrantySelect(
                                    warranty.id,
                                    warranty.price,
                                    warranty.name
                                  )
                                }
                              />
                              <span className="text-sm">{warranty?.name}</span>
                            </div>
                            <span className="text-sm font-semibold">
                              Tk {warranty.price?.toLocaleString("en-IN")}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Product Details Box */}
                  <div className="flex-1 flex flex-col border p-4 rounded-md border-[#C5D6E5] min-h-[150px]">
                    <div className="flex flex-col gap-4 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="border p-1 rounded-full border-[#C5D6E5]">
                            <CiCreditCard2 className="text-xl text-gray-700" />
                          </span>
                          <span className="text-xs font-bold">
                            Minimum Booking:
                          </span>
                        </div>
                        <p className="text-sm font-semibold">
                          {selectedBookingPrice
                            ? `${selectedBookingPrice} BDT`
                            : "0 BDT"}
                        </p>
                      </div>

                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="border p-1 rounded-full border-[#C5D6E5]">
                            <AiOutlineGift className="text-xl text-gray-700" />
                          </span>
                          <span className="text-xs font-bold">
                            Purchase Points:
                          </span>
                        </div>
                        <p className="text-sm font-semibold">
                          {selectedPurchasePoint
                            ? `${selectedPurchasePoint} points`
                            : "0 points"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="border p-1 rounded-full border-[#C5D6E5]">
                            <BsTruck className="text-xl text-gray-700" />
                          </span>
                          <span className="text-xs font-bold">
                            Estimated Delivery:
                          </span>
                        </div>
                        <p className="text-sm font-semibold">0-3 Days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ADD TO CART BUTTON */}
              <div className="pt-10">
                <StockWithButton
                  details={details}
                  estimateDiscount={finalPrice}
                  colorId={chooseColor}
                  // isPriceAvailable={isPriceAvailable}
                  variationId={choosedVariationId}
                  selectedColor={selectedColor}
                  selectedRamRom={selectedRamRom}
                  selectedImage={selectedImage}
                  selectedSim={selectedSim}
                  price={
                    selectedPrice
                      ? (
                          selectedPrice - (selectedDiscountPrice ?? 0)
                        ).toLocaleString("en-IN")
                      : "0"
                  }
                  bookingPrice={selectedBookingPrice}
                  extraWarrantyId={selectedExtraWarrantyId}
                  extraWarrantyPrice={selectedExtraWarrantyPrice}
                  extraWarrantyName={selectedExtraWarrantyName}
                  chipset={selectedChipset}
                  region={selectedRegion}

                  purchasePoint={selectedPurchasePoint}
                  setQuantity={setQuantity}
                  selectedPaymentMethod={selectedPaymentMethod}
                  instock={inStock}
                />
              </div>
            </div>
          </div>

          {/* BUY MORE SECTION */}
          <div className="w-full mt-5 bg-[#FFF] rounded-lg px-5 py-3 shadow-md">
            {/* Buy More Save More Section */}
            {details?.data?.highlightProduct?.length > 0 && (
              <>
                {" "}
                <div className="bg-gray-300 p-3 rounded-lg flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold">
                    🔥 Buy More Save More!
                  </span>
                </div>
                <div>
                  <HighLightProduct
                    highlights={details?.data?.highlightProduct}
                  />
                </div>
              </>
            )}

            {/* Kry Care Section */}

            {/* Terms & Conditions */}
            <div className="flex items-center mt-4">
              <input type="checkbox" className="w-3 h-3" checked />
              <span className="ml-2 text-gray-600">
                I agree to Kry’s{" "}
                <a href="#" className="text-blue-600 underline">
                  terms & conditions
                </a>
              </span>
            </div>

            {/* Total Price */}
            <div className="text-2xl font-bold text-primary my-8">
              TK. {finalPrice ? `${finalPrice?.toLocaleString("en-IN")}` : "0"}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
