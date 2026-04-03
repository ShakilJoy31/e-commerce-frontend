import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import StockWithButton from "./StockWIthButton";
import { GoShieldCheck } from "react-icons/go";
// import ReactImageMagnify from "react-image-magnify";
import { useCallback, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { CiCreditCard2 } from "react-icons/ci";
import { AiOutlineGift } from "react-icons/ai";
import { DiGitCompare } from "react-icons/di";
import { RiExchangeDollarFill } from "react-icons/ri";
import HighLightProduct from "./HighLightProduct";
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
import { useGetEmisQuery } from "@/components/store/api/emi/emiApi";
import { useGetBanksQuery } from "@/components/store/api/emi/bankApi";
import { BsTruck } from "react-icons/bs";
import { useSelector } from "react-redux";
import { selectUser } from "@/components/store/store";
import { Link } from "react-router-dom";
import { useCompare } from "@/components/context/CompareContext";
import ProductCompare from "@/pages/public/myAccount/ProductCompare";
import { MdInfoOutline } from "react-icons/md";
import { useGetPagesQuery } from "@/components/store/api/pages/pageApi";
import ExchangePolicy from "./ExchangePolicy";
import { useGetCompanyInfoAllQuery } from "@/components/store/api/company/companyApi";
import DiscountTimer from "./DiscountTimer";
import GiftProducts from "./GiftProducts";

interface ColorObj {
  stock: number;
}

interface Warranty {
  name: string;
  info: string;
}

export default function ProductsSpecification({ details }: any) {
  const [wishIsSuccess, setWishIsSuccess] = useState(false);
  const { addToWish, isProductInWishList } = useWishList();
  const { selectedProducts, setSelectedProducts, productIds, setProductIds } =
    useCompare();
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

  // Generate the product URL dynamically
  const productUrl = `https://kryinternational.com/products/${
    details?.data?.productLink || ""
  }`;

  const [selectedImage, setSelectedImage] = useState("");
  const [colorPrice, setColorPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [inStock, setInStock] = useState<boolean | null>(null);
  const [selecteColorObj, setSelectColorObj] = useState<ColorObj | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const defaultVariation = details?.data?.VariationProduct?.[0] || null;

  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [chooseColor, setChooseColor] = useState<number | null>(null);
  const [colorName, setColorName] = useState<string>("");
  const [selectedRamRom, setSelectedRamRom] = useState<string | null>(null);
  const [selectedRam, setSelectedRam] = useState<string | null>(null);
  const [selectedRom, setSelectedRom] = useState<string | null>(null);
  const [selectedSim, setSelectedSim] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [selectedStrapMaterial, setSelectedStrapMaterial] = useState<
    string | null
  >(null);
  const [selectedRegularWarranty, setSelectedRegularWarranty] =
    useState<Warranty | null>(null);
  const [isShippingFree, setIsShippingFree] = useState(false);

  const [selectedConnectivity, setSelectedConnectivity] = useState<
    string | null
  >(null);
  const [selectedPlugType, setSelectedPlugType] = useState<string | null>(null);
  const [selectedConnectorType, setSelectedConnectorType] = useState<
    string | null
  >(null);

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedChipset, setSelectedChipset] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  // const [choosedRamRom, setChoosedRamRom] = useState<string | null>(null);
  const [choosedVariationId, setChoosedVariationId] = useState<number | null>(
    null
  );
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [selectedTimer, setSelectedTimer] = useState(null);
  // const [isPriceAvailable, setIsPriceAvailable] = useState<boolean>(true);
  const [selectedDiscountPrice, setSelectedDiscountPrice] = useState<
    number | null
  >(0);
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
  const [availableSims, setAvailableSims] = useState<string[]>([]);
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  const [availableChipsets, setAvailableChipsets] = useState<string[]>([]);
  const [availableSize, setAvailableSize] = useState<string[]>([]);
  const [availableStrapMaterials, setAvailableStrapMaterials] = useState<
    string[]
  >([]);
  const [availableConnectivity, setAvailableConnectivity] = useState<string[]>(
    []
  );
  const [availablePlugTypes, setAvailablePlugTypes] = useState<string[]>([]);
  const [availableConnectorTypes, setAvailableConnectorTypes] = useState<
    string[]
  >([]);
  const [finalPrices, setFinalPrices] = useState<number>(0);
  const [giftId, setGiftId] = useState<number | null>(null);

  const calculateDiscounts = useCallback(
    (variation: any) => {
      let calculatedPrice = variation.price + colorPrice;
      let discountPrice = 0;
      let calculatedDiscountPercentage = 0;

      // 1. Apply Category Discount
      // if (details?.data?.category?.CategoryOffer?.discount) {
      //   const categoryDiscount = details.data.category.CategoryOffer.discount;
      //   if (details.data.category.CategoryOffer.discountType === "PERCENTAGE") {
      //     discountPrice = (calculatedPrice * categoryDiscount) / 100;
      //   } else if (
      //     details.data.category.CategoryOffer.discountType === "FIXED"
      //   ) {
      //     discountPrice = categoryDiscount;
      //   }
      //   calculatedPrice -= discountPrice;
      //   calculatedDiscountPercentage = (discountPrice / variation.price) * 100;
      // }

      // 2. Apply Brand Discount
      // if (details?.data?.brand?.BrandOffer?.discount && !discountPrice) {
      //   const brandDiscount = details.data.brand.BrandOffer.discount;
      //   if (details.data.brand.BrandOffer.discountType === "PERCENTAGE") {
      //     discountPrice = (calculatedPrice * brandDiscount) / 100;
      //   } else if (details.data.brand.BrandOffer.discountType === "FIXED") {
      //     discountPrice = brandDiscount;
      //   }
      //   calculatedPrice -= discountPrice;
      //   calculatedDiscountPercentage = (discountPrice / variation.price) * 100;
      // }

      // 3. Apply Product Discount (if available)
      if (variation.discountPrice && !discountPrice) {
        discountPrice = variation.discountPrice;
        calculatedPrice -= discountPrice;
        calculatedDiscountPercentage = (discountPrice / variation.price) * 100;
      }

      // 4. Apply OfferedProduct Discount (if any)
      // if (details?.data?.OfferedProduct?.length > 0) {
      //   const offeredProduct = details.data.OfferedProduct[0]; // Get the first offer (can be extended to multiple)
      //   const offer = offeredProduct.offer;
      //   if (offer && offer.discount) {
      //     let offerDiscount = 0;

      //     if (offer.discountType === "PERCENTAGE") {
      //       offerDiscount = (calculatedPrice * offer.discount) / 100;
      //     } else if (offer.discountType === "FIXED") {
      //       offerDiscount = offer.discount;
      //     }

      //     // Apply the offer discount
      //     calculatedPrice -= offerDiscount;
      //     calculatedDiscountPercentage += offerDiscount / variation.price;
      //     discountPrice += offerDiscount * 100;
      //   }
      // }

      // Set final calculated price and discount details
      setSelectedPrice(variation.price);
      setSelectedTimer(variation);

      setFinalPrices(calculatedPrice);
      setDiscount(discountPrice);
      setSelectedDiscountPrice(discountPrice);

      return calculatedDiscountPercentage;
    },
    [details?.data, colorPrice]
  );

  // SELECT THE DEFAULT VARIATION
  useEffect(() => {
    if (details?.data) {
      if (details?.variations?.length) {
        setSelectedRam(details.variations[0].ram);
        setSelectedRom(details.variations[0].rom);
        const selectedRamRomStr = `${details.variations[0].ram}/${details.variations[0].rom}`;
        setSelectedRamRom(selectedRamRomStr);
        setSelectedRegularWarranty(details?.variations[0].regularWarranty);
        setIsShippingFree(details?.variations[0].isShippedFree);
      }
      // else{
      //   const filteredSize = details?.data?.VariationProduct;
      //   let size: string[] = [];
      //   for (const s of filteredSize) {
      //     if (s.size) {
      //       const findSize = size.find(si => si === s.size);
      //       if (!findSize) {
      //         size.push(s.size);
      //       }
      //     }
      //   }
      //   setAvailableSize(size);
      //   if (availableSize.length) {
      //     setSelectedSize(availableSize[0])
      //   }
      // }
    }
  }, [details]);

  useEffect(() => {
    if (details?.data?.VariationProduct?.length) {
      const defaultVariation = details.data.VariationProduct[0];
      setSelectedVariation(defaultVariation);
      calculateDiscounts(defaultVariation);
    }
  }, [calculateDiscounts, details]);

  useEffect(() => {
    if (details.data) {
      const filteredSim = details?.data?.VariationProduct?.filter(
        (v) => v.ram === selectedRam && v.rom === selectedRom
      );
      const sim: string[] = [];
      for (const s of filteredSim) {
        if (s.sim) {
          const findSim = sim.find((sm) => sm === s.sim);
          if (!findSim) {
            sim.push(s.sim);
          }
        }
      }
      setAvailableSims(sim);
      if (availableSims.length) {
        setSelectedSim(sim[0]);
      }
    }
  }, [availableSims.length, details.data, selectedRam, selectedRom]);

  useEffect(() => {
    if (details.data) {
      if (selectedSim) {
        const filteredRegion = details?.data?.VariationProduct?.filter(
          (v) =>
            v.ram === selectedRam &&
            v.rom === selectedRom &&
            v.sim === selectedSim
        );
        const region: string[] = [];
        for (const r of filteredRegion) {
          if (r.region) {
            const findRegion = region.find((re) => re === r.region);
            if (!findRegion) {
              region.push(r.region);
            }
          }
        }
        setAvailableRegions(region);
        if (availableRegions.length) {
          setSelectedRegion(region[0]);
        }
      } else {
        const filteredRegion = details?.data?.VariationProduct?.filter(
          (v) => v.ram === selectedRam && v.rom === selectedRom
        );
        const region: string[] = [];
        for (const r of filteredRegion) {
          if (r.region) {
            const findRegion = region.find((rg) => rg === r.region);
            if (!findRegion) {
              region.push(r.region);
            }
          }
        }
        setAvailableRegions(region);
        if (availableRegions.length) {
          setSelectedRegion(region[0]);
        }
      }
    }
  }, [
    availableRegions.length,
    details.data,
    selectedRam,
    selectedRom,
    selectedSim,
  ]);

  useEffect(() => {
    if (details.data) {
      if (selectedRegion) {
        const filteredChipset = details?.data?.VariationProduct?.filter(
          (v) =>
            v.ram === selectedRam &&
            v.rom === selectedRom &&
            v.region === selectedRegion
        );
        const chipset: string[] = [];
        for (const c of filteredChipset) {
          if (c.chipset) {
            const findChipset = chipset.find((ch) => ch === c.chipset);
            if (!findChipset) {
              chipset.push(c.chipset);
            }
          }
        }
        setAvailableChipsets(chipset);
        if (availableChipsets.length) {
          setSelectedChipset(chipset[0]);
        }
      } else if (selectedSim) {
        const filteredChipset = details?.data?.VariationProduct?.filter(
          (v) =>
            v.ram === selectedRam &&
            v.rom === selectedRom &&
            v.sim === selectedSim
        );
        const chipset: string[] = [];
        for (const c of filteredChipset) {
          if (c.chipset) {
            const findChipset = chipset.find((ch) => ch === c.chipset);
            if (!findChipset) {
              chipset.push(c.chipset);
            }
          }
        }
        setAvailableChipsets(chipset);
        if (availableChipsets.length) {
          setSelectedChipset(chipset[0]);
        }
      } else {
        const filteredChipset = details?.data?.VariationProduct?.filter(
          (v) => v.ram === selectedRam && v.rom === selectedRom
        );
        const chipset: string[] = [];
        for (const c of filteredChipset) {
          if (c.chipset) {
            const findChipset = chipset.find((ch) => ch === c.chipset);
            if (!findChipset) {
              chipset.push(c.chipset);
            }
          }
        }
        setAvailableChipsets(chipset);
        if (availableChipsets.length) {
          setSelectedChipset(chipset[0]);
        }
      }
    }
  }, [
    availableChipsets.length,
    details.data,
    selectedRam,
    selectedRegion,
    selectedRom,
    selectedSim,
  ]);

  useEffect(() => {
    if (details.data) {
      if (selectedChipset) {
        const filteredSize = details?.data?.VariationProduct?.filter(
          (v) =>
            v.ram === selectedRam &&
            v.rom === selectedRom &&
            v.chipset === selectedChipset
        );
        const size: string[] = [];
        for (const s of filteredSize) {
          if (s.size) {
            const findSize = size.find((si) => si === s.size);
            if (!findSize) {
              size.push(s.size);
            }
          }
        }
        setAvailableSize(size);
        if (availableSize.length) {
          setSelectedSize(size[0]);
        }
      } else if (selectedRegion) {
        const filteredSize = details?.data?.VariationProduct?.filter(
          (v) =>
            v.ram === selectedRam &&
            v.rom === selectedRom &&
            v.region === selectedRegion
        );
        const size: string[] = [];
        for (const s of filteredSize) {
          if (s.size) {
            const findSize = size.find((si) => si === s.size);
            if (!findSize) {
              size.push(s.size);
            }
          }
        }
        setAvailableSize(size);
        if (availableSize.length) {
          setSelectedSize(size[0]);
        }
      } else if (selectedSim) {
        const filteredSize = details?.data?.VariationProduct?.filter(
          (v) =>
            v.ram === selectedRam &&
            v.rom === selectedRom &&
            v.sim === selectedSim
        );
        const size: string[] = [];
        for (const s of filteredSize) {
          if (s.size) {
            const findSize = size.find((si) => si === s.size);
            if (!findSize) {
              size.push(s.size);
            }
          }
        }
        setAvailableSize(size);
        if (availableSize.length) {
          setSelectedSize(size[0]);
        }
      } else if (selectedRam || selectedRom) {
        const filteredSize = details?.data?.VariationProduct?.filter(
          (v) => v.ram === selectedRam && v.rom === selectedRom
        );
        const size: string[] = [];
        for (const s of filteredSize) {
          if (s.size) {
            const findSize = size.find((si) => si === s.size);
            if (!findSize) {
              size.push(s.size);
            }
          }
        }
        setAvailableSize(size);
        if (availableSize.length) {
          setSelectedSize(size[0]);
        }
      } else {
        const filteredSize = details?.data?.VariationProduct;
        const size: string[] = [];
        for (const s of filteredSize) {
          if (s.size) {
            const findSize = size.find((si) => si === s.size);
            if (!findSize) {
              size.push(s.size);
            }
          }
        }
        setAvailableSize(size);
        if (size.length) {
          setSelectedSize(size[0]);
        }
      }
    }
  }, [
    selectedRam,
    selectedRom,
    selectedSim,
    selectedRegion,
    selectedChipset,
    details.data,
    availableSize.length,
  ]);

  useEffect(() => {
    if (details?.data) {
      const filteredStrapMaterial = details?.data?.VariationProduct?.filter(
        (v) =>
          v.ram === selectedRam &&
          v.rom === selectedRom &&
          v.sim === selectedSim &&
          v.region === selectedRegion
      );
      const strapMaterials: string[] = [];
      for (const s of filteredStrapMaterial) {
        if (s.strapMaterial) {
          const findMaterial = strapMaterials.find(
            (sm) => sm === s.strapMaterial
          );
          if (!findMaterial) {
            strapMaterials.push(s.strapMaterial);
          }
        }
      }
      setAvailableStrapMaterials(strapMaterials);
      if (strapMaterials.length) {
        setSelectedStrapMaterial(strapMaterials[0]);
      }
    }
  }, [selectedRam, selectedRom, selectedSim, selectedRegion, details?.data]);

  useEffect(() => {
    if (details?.data) {
      const filteredConnectivity = details?.data?.VariationProduct?.filter(
        (v) =>
          v.ram === selectedRam &&
          v.rom === selectedRom &&
          v.sim === selectedSim &&
          v.region === selectedRegion
      );
      const connectivityOptions: string[] = [];
      for (const c of filteredConnectivity) {
        if (c.connectivity) {
          const findConnectivity = connectivityOptions.find(
            (co) => co === c.connectivity
          );
          if (!findConnectivity) {
            connectivityOptions.push(c.connectivity);
          }
        }
      }
      setAvailableConnectivity(connectivityOptions);
      if (connectivityOptions.length) {
        setSelectedConnectivity(connectivityOptions[0]);
      }
    }
  }, [selectedRam, selectedRom, selectedSim, selectedRegion, details?.data]);

  useEffect(() => {
    if (details?.data) {
      const filteredPlugType = details?.data?.VariationProduct?.filter(
        (v) =>
          v.ram === selectedRam &&
          v.rom === selectedRom &&
          v.sim === selectedSim &&
          v.region === selectedRegion
      );
      const plugTypes: string[] = [];
      for (const p of filteredPlugType) {
        if (p.plugType) {
          const findPlugType = plugTypes.find((pt) => pt === p.plugType);
          if (!findPlugType) {
            plugTypes.push(p.plugType);
          }
        }
      }
      setAvailablePlugTypes(plugTypes);
      if (plugTypes.length) {
        setSelectedPlugType(plugTypes[0]);
      }
    }
  }, [selectedRam, selectedRom, selectedSim, selectedRegion, details?.data]);

  useEffect(() => {
    if (details?.data) {
      const filteredConnectorType = details?.data?.VariationProduct?.filter(
        (v) =>
          v.ram === selectedRam &&
          v.rom === selectedRom &&
          v.sim === selectedSim &&
          v.region === selectedRegion
      );
      const connectorTypes: string[] = [];
      for (const c of filteredConnectorType) {
        if (c.connectorType) {
          const findConnectorType = connectorTypes.find(
            (ct) => ct === c.connectorType
          );
          if (!findConnectorType) {
            connectorTypes.push(c.connectorType);
          }
        }
      }
      setAvailableConnectorTypes(connectorTypes);
      if (connectorTypes.length) {
        setSelectedConnectorType(connectorTypes[0]);
      }
    }
  }, [selectedRam, selectedRom, selectedSim, selectedRegion, details?.data]);

  // HANDLE WARRANTY SELECTION
  const handleWarrantySelect = (
    warrantyId: number,
    price: number,
    name: string
  ) => {
    if (selectedExtraWarrantyId === warrantyId) {
      // Deselect if the same warranty is clicked again
      setSelectedExtraWarrantyId(null);
      setSelectedExtraWarrantyPrice(null);
      setSelectedExtraWarrantyName(null);
    } else {
      // Select a new warranty and update price
      setSelectedExtraWarrantyId(warrantyId);
      setSelectedExtraWarrantyPrice(price);
      setSelectedExtraWarrantyName(name);
    }
  };

  // Calculate final price (discountPrice + selected warranty price)

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("cash");

  const finalPrice =
    (finalPrices + (selectedExtraWarrantyPrice ?? 0)) * quantity;
  const [filteredImages, setFilteredImages] = useState<any[]>([]);

  const handleImageClick = (imageUrl: string, colorId: number) => {
    setSelectedImage(imageUrl);
    setSelectedColor(colorId);
    // Find the color name from the filteredColors list
    const selectedColorObj = filteredColors.find(
      (color) => color?.colorId === colorId
    );

    if (selectedColorObj) {
      setColorName(selectedColorObj.color.color);
      setChooseColor(selectedColorObj?.id);
      setInStock(selectedColorObj.inStock);
      setColorPrice(selectedColorObj?.price);
      setSelectColorObj(selectedColorObj);
    }
  };

  // SHOW COLOR BASED ON THE SELECTED PRICE
  useEffect(() => {
    const images: any[] = [];
    if (selectedVariation && details?.data) {
      const variationColor = selectedVariation.ProductColor || [];
      // console.log({selectedVariation})
      setFilteredColors(variationColor);

      const productImage = details?.data?.ProductImage;

      const sortedVariationColor = [...variationColor].sort(
        (a, b) => Number(b.inStock) - Number(a.inStock)
      );

      // Process images for in-stock variations
      for (const v of sortedVariationColor) {
        const findImage = productImage?.find(
          (img) => img?.colorId === v?.colorId
        );
        if (findImage) {
          images.push(findImage);
        }
      }

      // If there are images, select the first one (in-stock one)
      if (images.length > 0) {
        const selectedColorObj = sortedVariationColor.find(
          (color) => color?.colorId === images[0]?.colorId
        );
        if (selectedColorObj) {
          setColorName(selectedColorObj.color.color);
          setChooseColor(selectedColorObj?.id);
          setInStock(selectedColorObj.inStock);
          setSelectColorObj(selectedColorObj);
          setColorPrice(selectedColorObj?.price);
          setSelectedImage(images[0].imageUrl);
        }
      }

      // Set the default selected color for in-stock images
      if (images.length) {
        setSelectedColor(images[0]?.colorId);
      }

      setFilteredImages(images);
    }
  }, [details?.data, selectedVariation, discount]);

  // SELECT FIRST IMAGE
  useEffect(() => {
    if (details?.data) {
      setSelectedImage(details?.data?.ProductImage?.[0]?.imageUrl || "");
    }
  }, [details]);

  useEffect(() => {
    if (details?.data) {
      const findVariation = details.data.VariationProduct.find((v) => {
        return (
          (!selectedSim || v.sim === selectedSim) &&
          (!selectedRam || v.ram === selectedRam) &&
          (!selectedRom || v.rom === selectedRom) &&
          (!selectedRegion || v.region === selectedRegion) &&
          (!selectedChipset || v.chipset === selectedChipset) &&
          (!selectedSize || v.size === selectedSize) &&
          (!selectedStrapMaterial ||
            v.strapMaterial === selectedStrapMaterial) &&
          (!selectedConnectivity || v.connectivity === selectedConnectivity) &&
          (!selectedPlugType || v.plugType === selectedPlugType) &&
          (!selectedConnectorType || v.connectorType === selectedConnectorType)
        );
      });

      console.log("variation", findVariation);
      if (findVariation) {
        setChoosedVariationId(findVariation.id);
        setSelectedVariation(findVariation);
        calculateDiscounts(findVariation);
        setSelectedPrice(findVariation.price);
        setSelectedTimer(findVariation);
        setSelectedDiscountPrice(findVariation.discountPrice);
        setSelectedBookingPrice(findVariation.bookingPrice);
        setSelectedRegularWarranty(findVariation?.regularWarranty);
        setIsShippingFree(findVariation?.isShippedFree);
        setSelectedPurchasePoint(findVariation.purchasePoint);
        setSelectedExtraWarranty(findVariation.ExtraWarranty || []);
      }
    }
  }, [
    selectedRam,
    selectedRom,
    selectedSim,
    selectedRegion,
    selectedChipset,
    selectedSize,
    selectedStrapMaterial,
    selectedConnectivity,
    selectedPlugType,
    selectedConnectorType,
    details?.data,
    calculateDiscounts,
    colorPrice,
  ]);

  // HANDLE WISHLIST
  const handleWishList = () => {
    const product = {
      id: details?.data?.id,
      image: details?.data?.ProductImage?.[0]?.imageUrl,
      title: details?.data?.productName,
      discountPrice: finalPrices,
      originalPrice: defaultVariation ? defaultVariation.price : 0,
      stock: inStock ? true : false,
      colorId: selectedColor,
      time: new Date().toLocaleString(),
    };
    addToWish(product);
    setWishIsSuccess(true);
  };

  const handleAddToCompare = () => {
    const activeVariation =
      selectedVariation ?? details?.data?.VariationProduct?.[0] ?? {};

    const compareProduct = {
      ...details?.data,
      variation: activeVariation,
    };

    const updatedProducts = [...selectedProducts];
    const updatedProductIds = [...productIds];

    if (!updatedProducts[0]) {
      updatedProducts[0] = compareProduct;
      updatedProductIds[0] = compareProduct.id;
    } else if (!updatedProducts[1]) {
      updatedProducts[1] = compareProduct;
      updatedProductIds[1] = compareProduct.id;
    } else {
      toast({
        title:
          "Both comparison slots are full! Clear one slot to add a new product.",
        variant: "destructive",
      });
      return;
    }

    setSelectedProducts(updatedProducts);
    setProductIds(updatedProductIds);

    toast({
      title: `"${compareProduct.productName}" added to compare`,
    });
  };

  // use the *real* product id here; prevents the duplicate-add edge-case
  const isInCompare = productIds.includes(details?.data?.id);

  // HANDLE COPY THE LINK
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
  const { data: companyInfo } = useGetCompanyInfoAllQuery({});
 

  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [lowestEmi, setLowestEmi] = useState<number | null>(null);
  const [lowestEffectiveCost, setLowestEffectiveCost] = useState<number | null>(
    null
  );
  const [lowestEmiMonth, setLowestEmiMonth] = useState<number | null>(null);
  
console.log(lowestEffectiveCost, lowestEmiMonth)
  // Set the first bank as the default selected bank when banks data is available
  useEffect(() => {
    if (banks?.data?.length && !selectedBank) {
      setSelectedBank(banks.data[0].name);
    }
  }, [banks, selectedBank]);

  const gatewayCharge = companyInfo?.data[0]?.gatewayCharge || 0;
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
        emiPlans.sort((a, b) => b.month - a.month);

        const gatewayChargeAmount =
          actualDiscountedPrice * (gatewayCharge / 100);
        if (emiPlans.length > 0) {
          const firstPlan = emiPlans[0];
          minEffectiveCost =
            actualDiscountedPrice +
            gatewayChargeAmount +
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
  }, [
    bankEmis,
    banks,
    selectedPrice,
    selectedDiscountPrice,
    selectedBank,
    gatewayCharge,
  ]);

  useEffect(() => {
    if (defaultVariation) {
      setSelectedSim(defaultVariation.sim ?? null);
      setSelectedRegion(defaultVariation.region ?? null);
      setSelectedChipset(defaultVariation.chipset ?? null);
      setSelectedStrapMaterial(defaultVariation.strapMaterial ?? null);
      setSelectedConnectivity(defaultVariation.connectivity ?? null);
      setSelectedConnectorType(defaultVariation.connectorType ?? null);
      setSelectedPlugType(defaultVariation.plugType ?? null);
    }
  }, [defaultVariation]);

  const all = "Published";
  const { data } = useGetPagesQuery({
    page: 1,
    size: 20,
    status: all,
  });

  const exchangePolicySlug = data?.data?.find(
    (s) => s.slug === "exchange-policy"
  );

  return (
    <SectionWrapper>
      <div className="grid grid-cols-12 gap-5 py-5 container mx-auto">
        {/* Product Images */}
        <div className="col-span-12 lg:col-span-6 relative">
          <div className="sticky top-20 self-start">
            <div className="grid grid-cols-12 mx-auto">
              <div className="col-span-12 lg:col-span-3 flex mx-auto gap-2 flex-col justify-top items-center order-last lg:order-first">
                <Swiper
                  direction={isMobile ? "horizontal" : "vertical"}
                  slidesPerView={4}
                  spaceBetween={10}
                  mousewheel={true}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Mousewheel, Pagination]}
                  className="mySwiper w-[350px] md:w-[400px] lg:w-full h-[100px] lg:h-[400px] py-5 px-2 md:px-5"
                >
                  {[...filteredColors]
                    .sort(
                      (a, b) =>
                        (b.inStock === true ? 1 : 0) -
                        (a.inStock === true ? 1 : 0)
                    )
                    ?.map((color, index) => {
                      const imageObj = details?.data.ProductImage.find(
                        (img) => img?.colorId === color?.colorId
                      );

                      return (
                        <SwiperSlide key={index}>
                          <img
                            className={`w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] p-2 bg-[#C6C6C6/200] shadow-lg rounded-sm cursor-pointer ${
                              selectedImage === imageObj?.imageUrl
                                ? "ring-2 ring-blue-500"
                                : ""
                            }`}
                            src={imageObj?.imageUrl}
                            alt={`Product Image ${index + 1}`}
                            onClick={() =>
                              handleImageClick(
                                imageObj?.imageUrl,
                                imageObj?.colorId
                              )
                            }
                          />
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </div>

              <div className="col-span-12 lg:col-span-9 relative">
                {/* Product Image with Image Tag */}
                <div className="relative bg-white shadow-lg rounded-lg p-3 w-full h-[300px] mx-auto md:w-[350px] md:h-[350px]  xl:w-[450px] xl:h-[450px]">
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
                  {/* Wishlist and Share Buttons */}
                  <div className="absolute z-20 top-2 right-5 flex items-center gap-3 p-2 rounded-lg">
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
                {(user?.role.toLowerCase() === "super_admin" ||
                  user?.role.toLowerCase() === "operation_admin") && (
                  <Link
                    to={`/kry-admin-portal/edit-product/${details?.data?.productLink}`}
                    className="border bg-primary rounded-md"
                  >
                    <span className="px-3 py-2 text-white">Edit</span>
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
                  className="w-full [&_ul]:space-y-1 [&_ol]:space-y-1 [&_li]:my-1 [&_li]:ml-4"
                />
              </div>
            )}

            {selectedRegularWarranty ? (
              <div className="flex items-center gap-1 px-2 py-1 rounded">
                {selectedRegularWarranty?.name && (
                  <>
                    <GoShieldCheck className=" w-5 h-5" />
                    <div>{selectedRegularWarranty?.name}</div>
                  </>
                )}

                {selectedRegularWarranty?.info && (
                  <div className="relative group inline-block">
                    {/* Info icon */}
                    <div className="cursor-pointer text-gray-600">
                      <MdInfoOutline />
                    </div>

                    {/* Tooltip box shown on hover */}
                    <div className="absolute left-0 bottom-full mb-3 z-10 hidden group-hover:block w-72 p-3 text-sm bg-white border border-gray-300 rounded-lg shadow-lg">
                      {/* Arrow pointing down */}
                      <div className="absolute bottom-[-6px] left-3 w-3 h-3 bg-white border-l border-b border-gray-300 rotate-45 z-[-1]"></div>

                      {/* Tooltip content */}
                      <div>
                        <strong className="block font-semibold mb-4">
                          WARRANTY INFO
                        </strong>
                        <p>{selectedRegularWarranty?.info}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3 items-center justify-between w-full my-5">
              <h2 className="text-sm items-center lg:text-sm font-bold text-start">
                {details?.data?.type === "Upcoming" ||
                details?.data?.type === "Draft" ? (
                  <>
                    Status:{" "}
                    <span className="text-sm animate-pulse font-bold text-blue-600">
                      Coming Soon...
                    </span>
                  </>
                ) : (
                  <div className="flex items-center gap-1">
                    <p>Status: </p>
                    {inStock &&
                    selecteColorObj &&
                    selecteColorObj?.stock > 0 ? (
                      <>
                        {" "}
                        <span className="bg-primary text-white px-4 py-0.5 rounded-full">
                          Limited Stock - {selecteColorObj?.stock}
                        </span>
                      </>
                    ) : (
                      <>
                        {" "}
                        {inStock ? (
                          <span className="bg-primary text-white px-4 py-0.5 rounded-full">
                            In Stock
                          </span>
                        ) : (
                          <span className="bg-red-600 text-white px-4 py-0.5 rounded-full">
                            Stock Out
                          </span>
                        )}
                      </>
                    )}
                  </div>
                )}
              </h2>

              {details?.data?.highlightText && (
                <p className="border rounded-full px-4 py-0.5 bg-gray-100 flex justify-center gap-2">
                  <span className="border-black text-primary animate-pulse text-xs lg:text-sm font-bold">
                    {details?.data?.highlightText}
                  </span>{" "}
                </p>
              )}

              <div>
                <p className="block lg:hidden text-lg font-semibold pb-1">
                  Order online via:
                </p>
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
                <div className="block lg:hidden pt-3">
                  {details?.data?.whatsAppNumber && (
                    <a
                      href={`tel:${details.data.whatsAppNumber}`}
                      className="px-3 py-0.5 rounded-md bg-blue-100 text-blue-800 font-semibold hover:bg-green-200 transition"
                    >
                      {details.data.whatsAppNumber}
                    </a>
                  )}
                </div>
              </div>

              <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogTrigger asChild>
                  <p
                    onClick={handleAddToCompare}
                    className="border cursor-pointer rounded-full px-3 py-0.5 bg-gray-100 flex items-center justify-center gap-1"
                  >
                    <DiGitCompare
                      size={20}
                      className={`${
                        isInCompare ? "text-primary" : "text-black"
                      }`}
                    />
                    <span
                      className={`border-black text-xs lg:text-sm font-semibold ${
                        isInCompare ? "text-primary" : "text-black"
                      }`}
                    >
                      Add To Compare
                    </span>{" "}
                  </p>
                </DialogTrigger>
                <DialogContent className="p-6 rounded-lg shadow-lg sm:max-w-[700px] h-[90vh] overflow-y-auto">
                  <ProductCompare setModalOpen={setModalOpen} />
                </DialogContent>
              </Dialog>
            </div>

            {/* <div className="prose prose-headings:font-bold prose-ul:list-disc prose-ol:list-decimal max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: filteredContent }}
                className="w-full [&_img]:w-full [&_img]:h-auto"
              />
            </div> */}
            {/* PRICE AND POLICY */}
            <div className="flex flex-wrap gap-y-3 items-center justify-between py-3">
              <div>
                <div>
                  <DiscountTimer data={selectedTimer} />
                </div>
                <>
                  {details?.data?.type === "Upcoming" ||
                  details?.data?.type === "Draft" ? (
                    ""
                  ) : (
                    <>
                      {" "}
                      <div className="flex items-center gap-1.5">
                        <h2 className="flex items-center gap-2 text-primary">
                          <span className="font-bold text-2xl">TK.</span>
                          <span className="font-bold text-2xl">
                            {finalPrices
                              ? finalPrices.toLocaleString("en-IN")
                              : "0"}
                          </span>
                        </h2>
                        {(selectedDiscountPrice !== 0 || discount !== 0) && (
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
                  )}{" "}
                </>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <p className="border rounded-full cursor-pointer px-3 py-0.5 bg-gray-100 flex items-center justify-center gap-1">
                    <RiExchangeDollarFill size={20} />
                    <span className="border-black text-xs lg:text-sm font-semibold">
                      Exchange Policy
                    </span>
                  </p>
                </DialogTrigger>
                <DialogContent className="max-w-[1200px] max-h-[90vh] overflow-y-auto">
                  <ExchangePolicy slug={exchangePolicySlug?.slug} />
                </DialogContent>
              </Dialog>
            </div>

            {/* COLOR TAB */}
            <div className="py-3">
              {/* Color Selection - Only show if colors exist */}
              <div className="flex flex-col gap-3 lg:flex-row justify-between">
                <div>
                  {filteredImages?.length > 0 && (
                    <div className="w-full">
                      <h2 className="text-base  mb-2">
                        <span className="font-semibold">Color</span>:{" "}
                        {colorName}
                      </h2>
                      <div className="flex gap-4 flex-wrap">
                        {[...filteredColors]
                          .sort(
                            (a, b) =>
                              (b.inStock === true ? 1 : 0) -
                              (a.inStock === true ? 1 : 0)
                          ) // Sort by inStock
                          .map((color) => {
                            const imageObj = details?.data.ProductImage.find(
                              (img) => img?.colorId === color?.colorId
                            );

                            return (
                              <div
                                key={color.colorId}
                                className={`w-8 h-8 lg:w-12 lg:h-12 p-0.5 rounded-full border-2 flex items-center justify-center overflow-hidden ${
                                  selectedColor === color?.colorId
                                    ? "border-primary"
                                    : "border-gray-300"
                                } cursor-pointer`}
                                onClick={() =>
                                  handleImageClick(
                                    imageObj?.imageUrl,
                                    imageObj?.colorId
                                  )
                                }
                              >
                                <img
                                  src={imageObj?.imageUrl}
                                  alt={imageObj?.color?.color || "Unknown"}
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
                              onClick={() => {
                                // handleRamRomSelect(variation.ram, variation.rom)
                                setSelectedRam(variation.ram);
                                setSelectedRom(variation.rom);
                                const selectedRamRomStr = `${variation.ram}/${variation.rom}`;
                                setSelectedRamRom(selectedRamRomStr);
                              }}
                              className={`px-3 py-1 border rounded-full text-sm font-semibold ${
                                selectedRamRom ===
                                `${variation.ram}/${variation.rom}`
                                  ? "border-primary"
                                  : "border-gray-300"
                              }`}
                            >
                              {variation.ram}/{variation.rom}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex gap-3 lg:gap-10 items-center">
                    {details?.data?.vendor && (
                      <h3 className="text-sm items-center lg:text-sm py-5 font-bold text-start">
                        Vendor:{" "}
                        <span className="border px-4 py-0.5 rounded-full">
                          {details?.data?.vendor?.name}
                        </span>
                      </h3>
                    )}
                    {/* {selectedSize && (
                  <h3 className="text-sm items-center lg:text-sm font-bold text-start">
                    Size:{" "}
                    <span className="border px-4 py-0.5 rounded-full">
                      {selectedSize}
                    </span>
                  </h3>
                )} */}
                  </div>

                  {/* SIM REGION CHIPSET */}
                  <div className="flex flex-wrap gap-3 lg:gap-7 pt-4 items-center">
                    {/* SIM Dropdown */}
                    {availableSims.length > 0 && (
                      <div className="flex items-center gap-1">
                        <label className="font-bold text-sm">SIM:</label>
                        <select
                          className="border px-2 py-0.5 rounded-full w-28"
                          value={selectedSim ?? ""}
                          onChange={(e) =>
                            // handleSelectionChange("sim", e.target.value)
                            setSelectedSim(e.target.value)
                          }
                        >
                          {availableSims.map((sim, index) => (
                            <option key={index} value={sim}>
                              {sim}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Region Dropdown */}
                    {availableRegions?.length > 0 && (
                      <div className="flex items-center gap-1">
                        <label className="font-bold text-sm">Region:</label>
                        <select
                          className="border px-2 py-0.5 rounded-full w-28"
                          value={selectedRegion ?? ""}
                          onChange={(e) => setSelectedRegion(e.target.value)}
                        >
                          {availableRegions.map((region, index) => (
                            <option key={index} value={region}>
                              {region}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Chipset Dropdown */}
                    {availableChipsets?.length > 0 && (
                      <div className="flex items-center gap-1">
                        <label className="font-bold text-sm">Chipset:</label>
                        <select
                          className="border px-2 py-0.5 rounded-full w-28"
                          value={selectedChipset ?? ""}
                          onChange={(e) => setSelectedChipset(e.target.value)}
                        >
                          {availableChipsets.map((chipset, index) => (
                            <option key={index} value={chipset}>
                              {chipset}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {/* Size Dropdown */}
                    {availableSize?.length > 0 && (
                      <div className="flex items-center gap-1">
                        <label className="font-bold text-sm">Size:</label>
                        <select
                          className="border px-2 py-0.5 rounded-full w-28"
                          value={selectedSize ?? ""}
                          onChange={(e) =>
                            // handleSelectionChange("chipset", e.target.value)
                            setSelectedSize(e.target.value)
                          }
                        >
                          {availableSize.map((size, index) => (
                            <option key={index} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {availableStrapMaterials.length > 0 && (
                      <div className="flex items-center gap-1">
                        <label className="font-bold text-sm">Material:</label>
                        <select
                          className="border px-2 py-0.5 rounded-full w-28"
                          value={selectedStrapMaterial ?? ""}
                          onChange={(e) =>
                            setSelectedStrapMaterial(e.target.value)
                          }
                        >
                          {availableStrapMaterials.map((material, index) => (
                            <option key={index} value={material}>
                              {material}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Connectivity Dropdown */}
                    {availableConnectivity.length > 0 && (
                      <div className="flex items-center gap-1">
                        <label className="font-bold text-sm">
                          Connectivity:
                        </label>
                        <select
                          className="border px-2 py-0.5 rounded-full w-28"
                          value={selectedConnectivity ?? ""}
                          onChange={(e) =>
                            setSelectedConnectivity(e.target.value)
                          }
                        >
                          {availableConnectivity.map((connectivity, index) => (
                            <option key={index} value={connectivity}>
                              {connectivity}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Plug Type Dropdown */}
                    {availablePlugTypes.length > 0 && (
                      <div className="flex items-center gap-1">
                        <label className="font-bold text-sm">Plug Type:</label>
                        <select
                          className="border px-2 py-0.5 rounded-full w-28"
                          value={selectedPlugType ?? ""}
                          onChange={(e) => setSelectedPlugType(e.target.value)}
                        >
                          {availablePlugTypes.map((plugType, index) => (
                            <option key={index} value={plugType}>
                              {plugType}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Connector Type Dropdown */}
                    {availableConnectorTypes.length > 0 && (
                      <div className="flex items-center gap-1">
                        <label className="font-bold text-sm">
                          Connector Type:
                        </label>
                        <select
                          className="border px-2 py-0.5 rounded-full w-28"
                          value={selectedConnectorType ?? ""}
                          onChange={(e) =>
                            setSelectedConnectorType(e.target.value)
                          }
                        >
                          {availableConnectorTypes.map(
                            (connectorType, index) => (
                              <option key={index} value={connectorType}>
                                {connectorType}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
                {details?.data?.ProductGift?.length > 0 ? (
                  <div>
                    <GiftProducts
                      details={details?.data?.ProductGift}
                      setGiftId={setGiftId}
                      giftId={giftId}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>

              {/* EMI PRICE AND OFFER PRICE */}
              {details?.data?.isEmi && (
                <div className="flex flex-col mt-7 md:flex-row justify-center items-center gap-6 w-full">
                  {/* Cash/Card/MFS Payment Option */}
                  <label className="flex items-center gap-3 px-3 py-4 w-full border rounded-lg border-[#C5D6E5] cursor-pointer">
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
                        <h3 className="text-xl font-semibold">
                          {selectedDiscountPrice ?? 0 > 0
                            ? "Offer Price"
                            : "Regular Price"}
                          :
                        </h3>
                        <p className="text-xl font-semibold">
                          TK. {finalPrice.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <span className="font-semibold text-base pt-1 text-gray-500">
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
                      checked={selectedPaymentMethod === "EMI"}
                      onChange={() => setSelectedPaymentMethod("EMI")}
                    />
                    <div>
                      <div className="flex justify-end py-0.5">
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
                      {/* <div className="flex justify-between items-center gap-5 w-full">
                        <div className="flex items-center gap-1">
                          <h3 className="text-sm font-semibold">EMI Price:</h3>
                          <p className="text-lg font-semibold">
                            {lowestEffectiveCost
                              ? Math.ceil(lowestEffectiveCost).toLocaleString("en-IN")
                              : "0"}{" "}
                            <span className="text-sm font-bold">
                              ({lowestEmiMonth ?? "-"} months)
                            </span>
                          </p>
                        </div>
                      </div> */}
                      <span className="text-xl font-semibold">
                        {lowestEmi ? lowestEmi.toFixed(0) : "0"}৳/Month
                      </span>
                      <div className="flex gap-3 items-center">
                        {details?.data?.freeEmiCharge ? (
                          <h3 className="text-lg text-gray-500 items-center py-0.5 font-bold text-start">
                            <span className="pr-0.5">0</span>% EMI for
                            <span className="px-1 py-0.5">
                              Up to {details?.data?.freeEmiCharge} months
                            </span>
                          </h3>
                        ) : (
                          <div className="flex items-center text-base py-0.5 font-semibold">
                            <span className="text-gray-500 mr-1">EMI:</span>
                            <span className="text-gray-500 px-2 py- rounded-md">
                              Up to 36 months
                            </span>
                          </div>
                        )}
                      </div>
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

              <div className="hidden lg:block">
                <div className="flex items-center justify-end mt-10">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold">
                      Order online via Phone call:
                    </p>
                    {details?.data?.whatsAppNumber && (
                      <a
                        href={`tel:+8801712807642`}
                        className="px-3 py-1 rounded-md bg-blue-100 text-blue-800 font-semibold hover:bg-green-200 transition"
                      >
                        {/* {details.data.whatsAppNumber} */}
                        +8801712807642
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* ADD TO CART BUTTON */}
              <div className="pt-10">
                <StockWithButton
                  details={details}
                  estimateDiscount={finalPrice}
                  colorId={chooseColor}
                  selecteColorObj={selecteColorObj}
                  type={details?.data?.type}
                  // isPriceAvailable={isPriceAvailable}
                  giftId={giftId}
                  variationId={choosedVariationId}
                  selectedColor={selectedColor}
                  selectedRamRom={selectedRamRom}
                  selectedImage={selectedImage}
                  selectedSim={selectedSim}
                  price={finalPrices}
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
                  isShippedFree={isShippingFree}
                />
              </div>
            </div>
          </div>

          {/* BUY MORE SECTION */}
          {/* className="w-full mt-5 bg-[#FFF] rounded-lg px-5 py-3 shadow-md" */}
          <div>
            {/* Buy More Save More Section */}
            {details?.data?.highlightProduct?.length > 0 && (
              <>
                <div className="bg-white shadow-lg rounded-lg p-3 mt-4">
                  {" "}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold">
                      Buy More Save More!
                    </span>
                  </div>
                  <div>
                    <HighLightProduct
                      highlights={details?.data?.highlightProduct}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Kry Care Section */}

            {/* Terms & Conditions */}
            {/* <div className="flex items-center mt-4">
              <input type="checkbox" className="w-3 h-3" checked />
              <span className="ml-2 text-gray-600">
                I agree to Kry’s{" "}
                <a href="#" className="text-blue-600 underline">
                  terms & conditions
                </a>
              </span>
            </div> */}

            {/* Total Price */}
            {/* {(details?.data?.type !== "Upcoming" ||
              details?.data?.type !== "Draft") && (
              <div className="text-2xl font-bold text-primary my-8">
                TK.{" "}
                {finalPrice ? `${finalPrice?.toLocaleString("en-IN")}` : "0"}
              </div>
            )} */}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
