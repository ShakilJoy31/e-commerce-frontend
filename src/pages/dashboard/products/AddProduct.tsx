import InputWrapper from "@/components/common/wrapper/InputWrapper";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import Input from "@/components/ui/input";

import {
  AddEditProductFormData,
  addEditProductSchema,
} from "@/schemas/product/addEditProductSchema";
import { ADD_EDIT_PRODUCT_FORM } from "@/utils/constant/products/addEditProductForm";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGetBrandsQuery } from "@/components/store/api/brand/brandApi";
import { useGetAllCategoryQuery } from "@/components/store/api/category/categoryApi";
import { useGetSubCategoryQuery } from "@/components/store/api/subCategory/subCategoryApi";
import {
  useAddProductMutation,
  useGetProductsQuery,
} from "@/components/store/api/products/productApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalizeEveryWord } from "@/utils/helper/capitalizeEveryWord";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { toast } from "react-hot-toast";
import FileInput from "@/components/ui/fileInput";
import {
  useAddThumbnailMutation,
  useGetGalleryQuery,
} from "@/components/store/api/file/fileApi";
import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { useGetFeatureQuery } from "@/components/store/api/featureKey/featurekeyApi";
import { useGetColorsQuery } from "@/components/store/api/color/colorApi";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Minus,
  MinusIcon,
  Plus,
} from "lucide-react";
import { removeNullishValue } from "@/utils/helper/removeNullishValue";
import { useGetRamsQuery } from "@/components/store/api/ram/ramApi";
import { useGetRomsQuery } from "@/components/store/api/rom/romApi";
import { useGetWhatsAppContactsQuery } from "@/components/store/api/whatsApp/whatsAppApi";
import { useGetHighlightTextsQuery } from "@/components/store/api/highlightText/highlightTextApi";
import { useGetSimsQuery } from "@/components/store/api/sim/simApi";
import { useNavigate } from "react-router-dom";
import { removeFalsyValuesProperties } from "@/utils/helper/removeFalsyValuesProperties";
import { useGetRegionsQuery } from "@/components/store/api/region/regionApi";
import { useGetChipsetsQuery } from "@/components/store/api/chipset/chipsetApi";
import { useGetSizesQuery } from "@/components/store/api/size/sizeApi";
import { useGetFeaturesQuery } from "@/components/store/api/featurelist/featurelistApi";
import { useGetConditionsQuery } from "@/components/store/api/condition/conditionApi";
import { useGetVendorsQuery } from "@/components/store/api/vendor/vendorApi";
import { useGetGiftsQuery } from "@/components/store/api/gift/giftApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetWarrantiesQuery } from "@/components/store/api/warranty/warrantyApi";
import MultiSelect from "@/components/ui/multiselect";
import { useGetPlugTypesQuery } from "@/components/store/api/plugType/plugTypeApi";
import { useGetConnectivitiesQuery } from "@/components/store/api/connectivity/connectivityApi";
import { useGetConnectorTypesQuery } from "@/components/store/api/connector/connectorApi";
import { useGetMaterialsQuery } from "@/components/store/api/mateiral/materialApi";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FiSearch } from "react-icons/fi";
import { useGetRegularWarrantiesQuery } from "@/components/store/api/regularWarranty/regularWarrantyApi";
import SearchableSelect from "./SearchableSelect";
import { useGetTagsQuery } from "@/components/store/api/tags/tagsApi";
import "react-quill/dist/quill.snow.css";
import TipTapEditor from "./TipTapEditor";
import TextArea from "@/components/ui/text-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Paragraph from "@/components/typography/Paragraph";
import { extractAltText } from "@/utils/helper/extractAltText";
import DateTimeInput from "@/components/ui/dateTimeInput";

const AddProduct = () => {
  const [uploadingImages, setUploadingImages] = useState<{
    [key: number]: boolean;
  }>({});
  const [heldProducts, setHeldProducts] = useState<any[]>([]);
  const [showHoldList, setShowHoldList] = useState(false);
  const [selectedHoldProduct, setSelectedHoldProduct] = useState<any>(null);
  const navigate = useNavigate();

  // GET ALL CATEGORIES QUERY
  const { data: categoryList, isLoading: categoryLoading } =
    useGetAllCategoryQuery({
      page: 1,
      size: 1000,
    });
  const { data: ramList, isLoading: ramLoading } = useGetRamsQuery({
    page: 1,
    size: 1000,
  });
  const { data: warrantyList, isLoading: warrantyLoading } =
    useGetWarrantiesQuery({
      page: 1,
      size: 1000,
    });
  const { data: romList, isLoading: romLoading } = useGetRomsQuery({
    page: 1,
    size: 1000,
  });
  const { data: vendorList, isLoading: vendorLoading } = useGetVendorsQuery({
    page: 1,
    size: 1000,
  });
  const { data: giftList, isLoading: giftLoading } = useGetGiftsQuery({
    page: 1,
    size: 1000,
  });
  const { data: regionList, isLoading: regionLoading } = useGetRegionsQuery({
    page: 1,
    size: 1000,
  });
  const { data: chipsetList, isLoading: chipsetLoading } = useGetChipsetsQuery({
    page: 1,
    size: 1000,
  });
  // const { data: whatsappList, isLoading: whatsappLoading } =
  //   useGetWhatsAppContactsQuery({
  //     page: 1,
  //     size: 1000,
  //   });
    const whatsappList = {
      data: ['01712807642', '01717999424', '01712920237']
    }
    const whatsappLoading = false; 

  const { data: highlighList, isLoading: highlightLoading } =
    useGetHighlightTextsQuery({
      page: 1,
      size: 1000,
    });
  const { data: tag } = useGetTagsQuery({
    page: 1,
    size: 1000,
  });
  const { data: simList, isLoading: simLoading } = useGetSimsQuery({
    page: 1,
    size: 1000,
  });
  const { data: sizeList, isLoading: sizeLoading } = useGetSizesQuery({
    page: 1,
    size: 1000,
  });
  const { data: plugList, isLoading: plugLoading } = useGetPlugTypesQuery({
    page: 1,
    size: 1000,
  });
  const { data: regularWarrantyList, isLoading: regularWarrantyLoading } =
    useGetRegularWarrantiesQuery({
      page: 1,
      size: 1000,
    });

  const { data: connectivityList, isLoading: connectivityLoading } =
    useGetConnectivitiesQuery({
      page: 1,
      size: 1000,
    });
  const { data: connectorList, isLoading: connectorLoading } =
    useGetConnectorTypesQuery({
      page: 1,
      size: 1000,
    });
  const { data: strapMaterialList, isLoading: strapMaterialLoading } =
    useGetMaterialsQuery({
      page: 1,
      size: 1000,
    });
  // GET ALL SUB CATEGORY QUERY
  const { data: subCategoryList } = useGetSubCategoryQuery({
    page: 1,
    size: 1000,
  });
  // GET ALL SUB CATEGORY QUERY
  const { data: colorList, isLoading: colorLoading } = useGetColorsQuery({
    page: 1,
    size: 1000,
  });
  // GET ALL BRANDS QUERY
  const { data: brandList, isLoading: brandLoading } = useGetBrandsQuery({
    page: 1,
    size: 1000,
  }) as any;
  const { data: featureList, isLoading: featuredLoading } = useGetFeaturesQuery(
    {
      page: 1,
      size: 1000,
    }
  ) as any;
  const { data: conditionList, isLoading: conditionLoading } =
    useGetConditionsQuery({
      page: 1,
      size: 1000,
    }) as any;

  const { data: products, isLoading: productLoading } = useGetProductsQuery({
    page: 1,
    size: 1000,
  });

  const { data: features, isLoading: featureLoading } = useGetFeatureQuery({
    page: 1,
    size: 1000,
  });
  // GET ALL FEATURES QUERY

  // ADD PRODUCT MUTATION
  const [addProduct, { isLoading: addProductLoading, error }] =
    useAddProductMutation({}) as any;
  // ADD THUMBNAIL MUTATION
  const [addThumbnail] = useAddThumbnailMutation({}) as any;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
    setError,
    watch,
    control,
    trigger,
  } = useForm<AddEditProductFormData>({
    resolver: yupResolver(addEditProductSchema),
    defaultValues: {
      type: "Published",
      isEmi: false,
      isFullPay: false,
      isPointUse: false,
      features: [{ featureKeyId: 0, value: "" }],
      images: [{ colorId: 0, imageUrl: "" }],
      highlightAccessories: [],
      gifts: [],
      freeEmiCharge: 0,
      variationProducts: [
        {
          ram: "",
          rom: "",
          sim: "",
          size: "",
          price: 0,
          region: "",
          chipset: "",
          strapMaterial: "",
          connectivity: "",
          plugType: "",
          regularWarrantyId: undefined,
          connectorType: "",
          isShippedFree: false,

          discountPrice: 0,
          preDiscountPrice: 0,
          startDate: "",
          endDate: "",
          // regularPrice: 0,
          bookingPrice: 0,
          purchasePoint: 0,
          colors: [{ colorId: 0, inStock: true, price: 0, stock: 0 }],
          extraWarranty: [{ name: "", price: 0 }],
        },
      ],
    },
  });

  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>(
    []
  );
  const [selectedTag, setSelectedTag] = useState<string[]>([]);
  const handleSubCategoryChange = (
    selectedValues: { label: string; value: string }[]
  ) => {
    const selectedIds = selectedValues.map((option) => Number(option.value));
    setSelectedSubCategories(selectedIds);
  };

  const handleTagChange = (
    selectedValues: { label: string; value: string }[]
  ) => {
    const selectedNames = selectedValues.map((option) => option.label);
    setSelectedTag(selectedNames);
  };

  // Effect to update form value when selectedSubCategories changes
  useEffect(() => {
    if (selectedSubCategories.length > 0) {
      setValue("subCategoryId", selectedSubCategories);
    }
    if (selectedTag.length > 0) {
      setValue("tag", selectedTag);
    }
  }, [selectedSubCategories, selectedTag, setValue]);

  const subCategoriesOptions =
    subCategoryList?.data
      ?.filter((c) => c?.categoryId === watch("categoryId"))
      .map((single) => ({
        label: single.name,
        value: single.id.toString(),
      })) || [];

  const tags =
    tag?.data.map((single) => ({
      label: single.name,
      value: single.id.toString(),
    })) || [];

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  const {
    fields: imagesFields,
    append: appendImages,
    remove: removeImages,
  } = useFieldArray({
    control,
    name: "images",
  });
  const {
    fields: accessoryFields,
    append: appendAccessory,
    remove: removeAccessory,
  } = useFieldArray({
    control,
    // @ts-ignore
    name: "highlightAccessories",
  });
  const {
    fields: giftFields,
    append: appendGift,
    remove: removeGift,
  } = useFieldArray({
    control,
    // @ts-ignore
    name: "gifts",
  });

  useEffect(() => {
    if (accessoryFields.length === 0) {
      // @ts-ignore
      appendAccessory(0);
    }
  }, [accessoryFields, appendAccessory]);

  const handleProductSelect = (productId: string, index: number) => {
    setValue(`highlightAccessories.${index}`, Number(productId));
    trigger(`highlightAccessories.${index}`);
  };
  const handleGiftSelect = (giftId: string, index: number) => {
    setValue(`gifts.${index}`, Number(giftId));
    trigger(`gifts.${index}`);
  };

  const handleAppendProduct = () => {
    // @ts-ignore
    appendAccessory(0);
  };
  const handleAppendGift = () => {
    // @ts-ignore
    appendGift(0);
  };

  const handleRemoveProduct = (index: number) => {
    removeAccessory(index);
  };
  const handleRemoveGift = (index: number) => {
    removeGift(index);
  };

  const {
    fields: variationFields,
    append: appendVariation,
    remove: removeVariation,
  } = useFieldArray({
    control,
    name: "variationProducts",
  });

  // Managing colors for each variation
  const addColor = (index: number) => {
    setValue(`variationProducts.${index}.colors`, [
      ...watch(`variationProducts.${index}.colors`),
      { colorId: 0, inStock: true, price: 0, stock: 0 },
    ]);
  };

  const removeColor = (index: number, colorIndex: number) => {
    const colors = watch(`variationProducts.${index}.colors`);
    colors.splice(colorIndex, 1);
    setValue(`variationProducts.${index}.colors`, colors);
  };

  // Managing warranties for each variation
  const addWarranty = (index: number) => {
    setValue(`variationProducts.${index}.extraWarranty`, [
      ...watch(`variationProducts.${index}.extraWarranty`),
      { name: "", price: 0 },
    ]);
  };

  const removeWarranty = (index: number, warrantyIndex: number) => {
    const warranties = watch(`variationProducts.${index}.extraWarranty`);
    warranties.splice(warrantyIndex, 1);
    setValue(`variationProducts.${index}.extraWarranty`, warranties);
  };

  const handleAddVariation = () => {
    appendVariation({
      ram: "",
      rom: "",
      sim: "",
      size: "",
      region: "",
      chipset: "",
      strapMaterial: "",
      connectivity: "",
      plugType: "",
      startDate: "",
      endDate: "",
      regularWarrantyId: undefined,
      connectorType: "",
      price: 0,
      discountPrice: 0,
      preDiscountPrice: 0,
      // regularPrice: 0,
      bookingPrice: 0,
      purchasePoint: 0,
      colors: [{ colorId: 0, inStock: true, price: 0, stock: 0 }],
      extraWarranty: [{ name: "", price: 0 }],
    });
  };

  const [openModal, setOpenModal] = useState(false);
  const [files, setFiles] = useState<{ [key: number]: File | undefined }>({});

  const [searchGallery, setSearchGallery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchGallery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchGallery]);

  const { data: galleries, isLoading: galleryLoading } = useGetGalleryQuery({
    search: debouncedSearch,
  });

  // Filter based on the key (since there is no name property)
  const filteredGalleries =
    galleries?.data?.filter((gallery) => {
      const searchTerm = searchGallery.toLowerCase();
      const galleryKey = gallery?.key?.toLowerCase() || "";
      return galleryKey.includes(searchTerm);
    }) || [];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [altTexts, setAltTexts] = useState<{ [key: number]: string }>({});

  const handleImageSelect = (index: number, imageUrl: string) => {
    setValue(`images.${index}.imageUrl`, imageUrl);
    setFiles((prev) => ({ ...prev, [index]: undefined }));
    setOpenModal(false);
  };

  const openGalleryForIndex = (index: number) => {
    setCurrentImageIndex(index);
    setOpenModal(true);
  };

  const handleAddImage = async (index: number, selectedFile: File) => {
    if (!selectedFile) {
      toast.error("Image not selected");
      return;
    }

    setUploadingImages((prev) => ({ ...prev, [index]: true }));
    setOpenModal(false);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      if (altTexts[index]) {
        formData.append("alt", altTexts[index]);
      }

      const uploadResponse = await addThumbnail(formData).unwrap();

      if (uploadResponse?.data) {
        const uploadedImageUrl = uploadResponse.data[0];
        const images = watch("images") ?? [];
        const selectedColorId = images[index]?.colorId ?? 0;

        if (!selectedColorId) {
          toast.error("Please select a color before adding an image.");
          return;
        }

        // Update form data for the specific index
        setValue(`images.${index}.imageUrl`, uploadedImageUrl);
        setValue(`images.${index}.colorId`, selectedColorId);

        // Update uploading state
        setUploadingImages((prev) => ({ ...prev, [index]: false }));

        // Success notification
        toast.success("The image has been uploaded successfully!");

        // Clear only the uploaded file for the specific index
        setFiles((prev) => ({ ...prev, [index]: undefined }));
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error("Something went wrong while uploading the image.");
    }
  };

  const isEmiApplied = watch("isEmi");

  const giveRequiredError = (data: AddEditProductFormData) => {
    const errorMessages: string[] = [];

    // Check if price is missing or invalid
    // if (
    //   !data.variationProducts ||
    //   data.variationProducts.some(
    //     (variation) => !variation.price || isNaN(variation.price)
    //   )
    // ) {
    //   errorMessages.push("Price is missing or invalid.");
    // }

    // Check if colorId is missing
    if (
      !data.variationProducts ||
      data.variationProducts.some(
        (variation) =>
          !variation.colors || variation.colors.some((color) => !color.colorId)
      )
    ) {
      errorMessages.push("Color ID is missing.");
    }

    return errorMessages;
  };

  const handleAddProduct = async (data: AddEditProductFormData) => {
    const errorMessages = giveRequiredError(data);
    if (errorMessages.length > 0) {
      // Show the error messages using toast
      toast.error(errorMessages.join(" "));
      return;
    }
    // @ts-ignore
    data.variationProducts = data.variationProducts.map((variation) => {
      const updatedVariation = {
        ...variation,
        ram: variation.ram,
        rom: variation.rom,
        sim: variation.sim,
        size: variation.size,
        price: Number(variation.price),
        discountPrice: Number(variation.discountPrice),
        region: variation.region?.trim() === "" ? undefined : variation.region,
        chipset:
          variation.chipset?.trim() === "" ? undefined : variation.chipset,
        bookingPrice: Number(variation.bookingPrice),
        purchasePoint: Number(variation.purchasePoint),
      };

      if (updatedVariation.colors) {
        updatedVariation.colors = removeNullishValue(updatedVariation.colors, [
          "colorId",
          "inStock",
          "price",
          "stock",
        ]);
      }

      if (updatedVariation.extraWarranty) {
        updatedVariation.extraWarranty = removeNullishValue(
          updatedVariation.extraWarranty,
          ["name", "price"]
        );
      }

      const cleanedVariation = removeFalsyValuesProperties(updatedVariation, [
        "ram",
        "rom",
        "sim",
        "region",
        "size",
        "strapMaterial",
        "connectivity",
        "plugType",
        "connectorType",
        "regularWarrantyId",
        "warrantyInfo",
        "chipset",
        "price",
        "discountPrice",
        "preDiscountPrice",
        "startDate",
        "endDate",
        // "regularPrice",
        "bookingPrice",
        "purchasePoint",
      ]);

      return cleanedVariation;
    });
    if (data.features) {
      data.features = removeNullishValue(data.features, [
        "featureKeyId",
        "value",
      ]);

      if (data.features.length === 0) {
        data.features = undefined;
      }
    }

    if (data.highlightAccessories) {
      data.highlightAccessories = data.highlightAccessories.filter(
        (item) => item !== 0 && item !== null && item !== undefined
      );

      data.highlightAccessories = removeNullishValue(
        data.highlightAccessories,
        []
      );
    }
    if (data.gifts) {
      data.gifts = data.gifts.filter(
        (item) => item !== 0 && item !== null && item !== undefined
      );

      data.gifts = removeNullishValue(data.gifts, []);
    }

    const updateData = removeFalsyValuesProperties(data, [
      "vendorId",
      "inBox",
      "description",
      "sortDescription",
      "specification",
      "description",
      "highlightText",
      "tag",
      "inSideDeliveryCharge",
      "outSideDeliveryCharge",
      "tag",
      "seoDescription",
      "seoTitle",
      "freeEmiCharge",
      "orderLimit",
    ]);

    updateData.isEmi = isEmiApplied;

    const result = await addProduct(updateData);
    if (result?.data?.data && result?.data?.success) {
      toast.success("Product added successfully");
      const productId = result?.data?.data?.productLink;

      if (productId) {
        navigate(`/kry-admin-portal/edit-product/${productId}`);
      }
      reset();
    }
  };

  const handleHold = () => {
    const formData = getValues();
    const productToHold = {
      id: Date.now(),
      data: {
        formData,
        selectedSubCategories,
        files,
        altTexts,
      },
      name: formData.productName || `Product ${heldProducts.length + 1}`,
      timestamp: new Date().toLocaleString(),
    };

    const updatedHeldProducts = [...heldProducts, productToHold];
    setHeldProducts(updatedHeldProducts);
    localStorage.setItem("heldProducts", JSON.stringify(updatedHeldProducts));
    toast.success(`${productToHold.name} has been held`);
    reset();
    setSelectedSubCategories([]);
  };

  const loadHeldProducts = () => {
    const storedHeldProducts = localStorage.getItem("heldProducts");
    if (storedHeldProducts) {
      setHeldProducts(JSON.parse(storedHeldProducts));
    }
  };

  const removeHeldProduct = (id: number) => {
    const updatedHeldProducts = heldProducts.filter(
      (product) => product.id !== id
    );
    setHeldProducts(updatedHeldProducts);
    localStorage.setItem("heldProducts", JSON.stringify(updatedHeldProducts));
  };

  const applyHeldProduct = (product: any) => {
    const { formData, selectedSubCategories, files, altTexts } = product.data;

    // Reset form first
    reset();

    // Set form values
    Object.entries(formData).forEach(([key, value]) => {
      // @ts-ignore
      setValue(key, value);
    });

    // Set other states
    setSelectedSubCategories(selectedSubCategories || []);
    setFiles(files || {});
    setAltTexts(altTexts || {});

    // Remove the applied product from heldProducts
    const updatedHeldProducts = heldProducts.filter((p) => p.id !== product.id);
    setHeldProducts(updatedHeldProducts);
    localStorage.setItem("heldProducts", JSON.stringify(updatedHeldProducts));

    setSelectedHoldProduct(product);
    setShowHoldList(false);
    toast.success(`${product.name} loaded from hold list`);
  };

  const HoldListModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Hold Products</h3>
          <button
            onClick={() => setShowHoldList(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {heldProducts.length === 0 ? (
          <p className="text-gray-500">No products hold yet</p>
        ) : (
          <div className="space-y-2">
            {heldProducts.map((product) => (
              <div
                key={product.id}
                className={`p-3 border rounded flex justify-between items-center ${
                  selectedHoldProduct?.id === product.id
                    ? "bg-blue-50 border-blue-300"
                    : ""
                }`}
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.timestamp}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => applyHeldProduct(product)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => removeHeldProduct(product.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  useEffect(() => {
    loadHeldProducts();
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <PageWrapper className="bg-white shadow-lg p-4 rounded-md overflow-hidden">
      {showHoldList && <HoldListModal />}
      <form
        onSubmit={handleSubmit(handleAddProduct)}
        className="overflow-hidden"
      >
        <div className="flex items-center justify-end gap-2 py-3">
          <button
            type="submit"
            className="px-4 flex items-center py-1 bg-blue-500 text-white font-sisEmibold rounded hover:bg-blue-600"
          >
            {addProductLoading && <ButtonLoader />}
            Submit
          </button>
          <button
            type="button"
            onClick={handleHold}
            className="px-4 py-1 bg-gray-500 text-white font-semiBold rounded hover:bg-gray-600"
          >
            Hold
          </button>

          <button
            type="button"
            onClick={() => setShowHoldList(true)}
            className="px-4 py-1 bg-purple-500 text-white font-semiBold rounded hover:bg-purple-600"
          >
            Hold List ({heldProducts.length})
          </button>
        </div>
        <SectionWrapper className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border border-primary p-4 rounded-md">
          {/* TYPE */}
          <InputWrapper
            label={"Select a Type"}
            labelFor="product_category"
            error={errors?.type?.message}
          >
            <Select
              value={watch("type")}
              onValueChange={(
                value: "Draft" | "Trust" | "Published" | "Upcoming"
              ) => {
                setValue("type", value);
                setError("type", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="product_category">
                <SelectValue placeholder={"Select a type..."} />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Trust">Trash</SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* PRODUCT NAME */}
          <InputWrapper
            label={ADD_EDIT_PRODUCT_FORM.productName.label}
            labelFor="product_name"
            error={errors?.productName?.message}
          >
            <Input
              placeholder={ADD_EDIT_PRODUCT_FORM.productName.placeholder}
              value={watch("productName") || ""}
              onChange={(e) => setValue("productName", e.target.value)}
              errorMessage={errors.productName?.message}
            />
          </InputWrapper>

          {/* PRODUCT CATEGORY */}
          <InputWrapper
            label={ADD_EDIT_PRODUCT_FORM.categoryId.label}
            labelFor="product_category"
            error={errors?.categoryId?.message}
          >
            <SearchableSelect
              label="Category"
              labelFor="product_category"
              value={watch("categoryId")?.toString()}
              onValueChange={(value) => {
                setValue("categoryId", +value);
                setError("categoryId", { type: "custom", message: "" });
              }}
              options={categoryList?.data ?? []}
              error={errors?.categoryId?.message}
              loading={categoryLoading}
              labelKey="name"
            />
          </InputWrapper>

          {/* PRODUCT SUB CATEGORY */}
          <InputWrapper
            label={ADD_EDIT_PRODUCT_FORM.subCategoryId.label}
            labelFor="product_sub_category"
            error={errors?.subCategoryId?.message}
          >
            <MultiSelect
              name="subCategoryId"
              label="Subcategories"
              options={subCategoriesOptions}
              onChange={handleSubCategoryChange}
              defaultValue={subCategoriesOptions.filter((option) =>
                selectedSubCategories.includes(Number(option.value))
              )}
              disabled={!watch("categoryId")}
            />
          </InputWrapper>

          {/* PRODUCT BRAND */}
          <InputWrapper
            label={ADD_EDIT_PRODUCT_FORM.brandId.label}
            labelFor="brand"
            error={errors?.brandId?.message}
          >
            <SearchableSelect
              label={"Brand"}
              labelFor="brand"
              value={watch("brandId")?.toString()}
              onValueChange={(value: string) => {
                setValue("brandId", +value);
                setError("brandId", { type: "custom", message: "" });
              }}
              options={brandList?.data ?? []}
              error={errors?.brandId?.message}
              loading={brandLoading}
              labelKey="brand"
            />
          </InputWrapper>

          {/* FEATURE NAME */}
          <InputWrapper
            label={ADD_EDIT_PRODUCT_FORM.featureId.label}
            labelFor="product_feature"
            error={errors?.featureId?.message}
          >
            <SearchableSelect
              label="Feature"
              labelFor="product_feature"
              value={watch("featureId")?.toString() ?? ""}
              onValueChange={(value: string) => {
                setValue("featureId", value === "none" ? undefined : +value);
                setError("featureId", { type: "custom", message: "" });
              }}
              options={featureList?.data ?? []}
              error={errors?.featureId?.message}
              loading={featuredLoading}
              labelKey="name"
              noneOption={true}
            />
          </InputWrapper>

          {/* VENDOR NAME */}
          <InputWrapper
            label={ADD_EDIT_PRODUCT_FORM.vendorId.label}
            labelFor="product_vendor"
            error={errors?.vendorId?.message}
          >
            <SearchableSelect
              label="Vendor"
              labelFor="product_vendor"
              value={watch("vendorId")?.toString() ?? ""}
              onValueChange={(value: string) => {
                setValue("vendorId", value === "none" ? undefined : +value);
                setError("vendorId", { type: "custom", message: "" });
              }}
              options={vendorList?.data ?? []}
              error={errors?.vendorId?.message}
              loading={vendorLoading}
              labelKey="name"
              noneOption={true}
            />
          </InputWrapper>

          {/* PRODUCT CONDITION */}
          <InputWrapper
            label={ADD_EDIT_PRODUCT_FORM.conditionId.label}
            labelFor="product_condition"
            error={errors?.conditionId?.message}
          >
            <SearchableSelect
              label="Condition"
              labelFor="product_condition"
              value={watch("conditionId")?.toString() ?? ""}
              onValueChange={(value: string) => {
                setValue("conditionId", value === "none" ? undefined : +value);
                setError("conditionId", { type: "custom", message: "" });
              }}
              options={conditionList?.data ?? []}
              error={errors?.conditionId?.message}
              loading={conditionLoading}
              labelKey="name"
              noneOption={true}
            />
          </InputWrapper>

          {/* HIGHLIGHT TEXT */}
          <InputWrapper
            label={"Highlight Text"}
            labelFor="highlight_text"
            error={errors?.highlightText?.message}
          >
            <SearchableSelect
              label={"Highlight Text"}
              labelFor="highlight_text"
              value={watch("highlightText") ?? ""}
              onValueChange={(value: string) => {
                setValue("highlightText", value === "none" ? undefined : value);
                setError("highlightText", { type: "custom", message: "" });
              }}
              options={highlighList?.data ?? []}
              error={errors?.highlightText?.message}
              loading={highlightLoading}
              labelKey="text"
              valueKey="text"
              noneOption={true}
            />
          </InputWrapper>

          {/* WHATSAPP NUMBER */}
          <InputWrapper
            label={"Whatsapp number ✽"}
            labelFor="product_category"
            error={errors?.whatsAppNumber?.message}
          >
            <Select
              value={watch("whatsAppNumber")}
              onValueChange={(value: string) => {
                setValue("whatsAppNumber", value);
                setError("whatsAppNumber", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="product_category" className="">
                <SelectValue placeholder={"Select a number..."} />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                {whatsappList?.data?.length > 0 &&
                  whatsappList?.data?.map((singleCategory: any) => (
                    <SelectItem
                      key={singleCategory}
                      value={singleCategory}
                    >
                      {capitalizeEveryWord(singleCategory)}
                    </SelectItem>
                  ))}
                {!whatsappList?.data?.length && whatsappLoading && (
                  <div className="flex justify-center w-full h-8 items-center bg-accent rounded-md">
                    <ButtonLoader />
                  </div>
                )}
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* DELIVERY CHARGE INSIDE DHAKA */}
          {/* <InputWrapper
            label="Delivery charge inside Dhaka"
            labelFor={`inSideDeliveryCharge`}
            error={errors?.inSideDeliveryCharge?.message}
            className="w-full"
          >
            <input
              type="text"
              placeholder="Enter Charge"
              className="border border-gray-500 pl-3 py-1.5 rounded-md text-gray-700 focus:outline-none focus:ring-2"
              value={watch(`inSideDeliveryCharge`) || ""}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only numbers or empty value for the price field
                if (/^[0-9]*$/.test(value)) {
                  setValue(`inSideDeliveryCharge`, Number(value || 0), {
                    shouldValidate: true,
                  });
                }
              }}
            />
          </InputWrapper> */}
          {/* DELIVERY CHARGE OUTSIDE DHAKA */}
          {/* <InputWrapper
            label="Delivery charge Outside Dhaka"
            labelFor={`outSideDeliveryCharge`}
            error={errors?.outSideDeliveryCharge?.message}
            className="w-full"
          >
            <input
              type="text"
              placeholder="Enter Charge"
              className="border border-gray-500 pl-3 py-1.5 rounded-md text-gray-700 focus:outline-none focus:ring-2"
              value={watch(`outSideDeliveryCharge`) || ""}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only numbers or empty value for the price field
                if (/^[0-9]*$/.test(value)) {
                  setValue(`outSideDeliveryCharge`, Number(value || 0), {
                    shouldValidate: true,
                  });
                }
              }}
            />
          </InputWrapper> */}

          {/* Tag name */}
          {/* <InputWrapper
            label={ADD_EDIT_PRODUCT_FORM.tag.label}
            labelFor="tag_name"
            error={errors?.tag?.message}
          >
            <SearchableSelect
              label={"Select Tag"}
              labelFor="tag_name"
              value={watch("tag") ?? ""}
              onValueChange={(value: string) => {
                setValue("tag", value);
                setError("tag", { type: "custom", message: "" });
              }}
              options={tag?.data ?? []}
              error={errors?.tag?.message}
              loading={tagLoading}
              labelKey="name"
              valueKey="name"
            />
          </InputWrapper> */}
          <InputWrapper
            label={ADD_EDIT_PRODUCT_FORM.tag.label}
            labelFor="tag"
            error={errors?.tag?.message}
          >
            <MultiSelect
              name="tag"
              label="Tag"
              options={tags}
              onChange={handleTagChange}
              defaultValue={tags.filter((option) =>
                selectedTag.includes(option.label)
              )}
            />
          </InputWrapper>
          <InputWrapper
            label="SEO Title"
            labelFor="seoTitle"
            error={errors.seoTitle?.message}
          >
            <Input
              placeholder="Enter SEO title"
              value={watch("seoTitle") || ""}
              onChange={(e) => setValue("seoTitle", e.target.value)}
            />
          </InputWrapper>

          {/* SEO Description */}
          <InputWrapper
            label="SEO Description"
            labelFor="seoDescription"
            error={errors.seoDescription?.message}
          >
            <TextArea
              placeHolder="Enter SEO description"
              currentValue={watch("seoDescription") || ""}
              onChange={(e) => setValue("seoDescription", e.target.value)}
              errorMessage={errors.seoDescription?.message}
              row={5}
            />
          </InputWrapper>

          {/* GIFT LIST */}
          <SectionWrapper className="px-4 py-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Gift Products
            </label>

            {giftFields.length === 0 &&
              (() => {
                handleAppendGift();
                return null;
              })()}
            {giftFields.map((item, index) => {
              return (
                <div key={item.id} className="w-full">
                  <SearchableSelect
                    label={"Gift"}
                    labelFor="gift"
                    onValueChange={(value) => {
                      handleGiftSelect(value, index);
                    }}
                    value={watch(`gifts.${index}`)?.toString() || ""}
                    options={giftList?.data ?? []}
                    loading={giftLoading}
                    labelKey="name"
                    noneOption={true}
                  />

                  {giftFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveGift(index)}
                      className="text-red-500 hover:text-red-700 font-medium text-sm pr-2"
                    >
                      <Minus />
                    </button>
                  )}
                </div>
              );
            })}

            {/* Add Gift Button */}
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={handleAppendGift}
                className="p-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition"
              >
                <Plus />
              </button>
            </div>
          </SectionWrapper>
          {isEmiApplied && (
            <InputWrapper
              label="Free EMI Duration"
              labelFor="freeEmiCharge"
              error={errors?.freeEmiCharge?.message}
            >
              <Select
                value={watch("freeEmiCharge")?.toString() || "0"}
                onValueChange={(value: string) => {
                  setValue("freeEmiCharge", Number(value));
                }}
              >
                <SelectTrigger id="emi_duration">
                  <SelectValue placeholder="Select EMI duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 month</SelectItem>
                  <SelectItem value="3">3 months</SelectItem>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="9">9 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                  <SelectItem value="24">24 months</SelectItem>
                  <SelectItem value="36">36 months</SelectItem>
                </SelectContent>
              </Select>
            </InputWrapper>
          )}

          <div className="flex items-center gap-1 pb-4 pl-2">
            <input
              type="checkbox"
              {...register("isEmi")}
              defaultChecked={false}
              className="w-5 h-5"
            />
            <span>Apply Emi</span>
          </div>
          <div className="flex items-center gap-1">
            <input
              className="w-5 h-5"
              type="checkbox"
              {...register(`isFullPay`)}
            />
            <span className="text-base font-semibold">Is Full Pay?</span>
          </div>
          <div className="flex items-center gap-1">
            <input
              className="w-5 h-5"
              type="checkbox"
              {...register(`isPointUse`)}
            />
            <span className="text-base font-semibold">
              isPointUsed?
            </span>
          </div>
          <InputWrapper
            label="Order Limit"
            labelFor={`orderLimit`}
            error={errors?.orderLimit?.message}
            className="w-full"
          >
            <input
              type="text"
              {...register(`orderLimit`, {
                valueAsNumber: true,
              })}
              placeholder="Enter Order Limit"
              className="border border-gray-500 pl-3 py-1.5 rounded-md text-gray-700 focus:outline-none focus:ring-2"
              onChange={(e) => {
                const value = e.target.value;
                setValue(`orderLimit`, value === "" ? 0 : Number(value), {
                  shouldValidate: true,
                });
              }}
              value={watch(`orderLimit`) ?? 0}
            />
          </InputWrapper>
        </SectionWrapper>

        <div className="">
          {/* VARIATION PRODUCT */}
          <SectionWrapper className="my-5 border border-primary p-4 rounded-md">
            {variationFields?.length > 0 &&
              variationFields?.map((field: any, index: any) => (
                <div>
                  <SectionWrapper
                    key={field.id}
                    className="grid grid-cols-3 gap-3"
                  >
                    {/* RAM */}
                    <InputWrapper
                      label={"RAM"}
                      labelFor={`variationProducts.${index}.ram`}
                      error={errors?.variationProducts?.[index]?.ram?.message}
                    >
                      <SearchableSelect
                        label={"Ram"}
                        labelFor="ram_select"
                        value={watch(`variationProducts.${index}.ram`) ?? ""}
                        onValueChange={(value: string) => {
                          setValue(
                            `variationProducts.${index}.ram`,
                            value === "none" ? undefined : value
                          );
                        }}
                        options={ramList?.data ?? []}
                        error={errors?.variationProducts?.[index]?.ram?.message}
                        loading={ramLoading}
                        labelKey="ram"
                        valueKey="ram"
                        noneOption={true}
                      />
                    </InputWrapper>

                    {/* ROM */}
                    <InputWrapper
                      label={"ROM"}
                      labelFor={`variationProducts.${index}.rom`}
                      error={errors?.variationProducts?.[index]?.rom?.message}
                    >
                      <SearchableSelect
                        label={"Rom"}
                        labelFor="rom_select"
                        value={watch(`variationProducts.${index}.rom`) ?? ""}
                        onValueChange={(value: string) => {
                          setValue(
                            `variationProducts.${index}.rom`,
                            value === "none" ? undefined : value
                          );
                        }}
                        options={romList?.data ?? []}
                        error={errors?.variationProducts?.[index]?.rom?.message}
                        loading={romLoading}
                        labelKey="rom"
                        valueKey="rom"
                        noneOption={true}
                      />
                    </InputWrapper>

                    {/*  SIM */}
                    <InputWrapper
                      label={"SIM"}
                      labelFor={`variationProducts.${index}.sim`}
                      error={errors?.variationProducts?.[index]?.sim?.message}
                    >
                      <SearchableSelect
                        label={"SIM"}
                        labelFor="sim_select"
                        value={watch(`variationProducts.${index}.sim`) ?? ""}
                        onValueChange={(value: string) => {
                          setValue(
                            `variationProducts.${index}.sim`,
                            value === "none" ? undefined : value
                          );
                        }}
                        options={simList?.data ?? []}
                        error={errors?.variationProducts?.[index]?.sim?.message}
                        loading={simLoading}
                        labelKey="sim"
                        valueKey="sim"
                        noneOption={true}
                      />
                    </InputWrapper>
                    {/* SIZE */}
                    <InputWrapper
                      label={"Size"}
                      labelFor={`variationProducts.${index}.size`}
                      error={errors?.variationProducts?.[index]?.size?.message}
                    >
                      <SearchableSelect
                        label={"Size"}
                        labelFor="size_select"
                        value={watch(`variationProducts.${index}.size`) ?? ""}
                        onValueChange={(value: string) => {
                          setValue(
                            `variationProducts.${index}.size`,
                            value === "none" ? undefined : value
                          );
                        }}
                        options={sizeList?.data ?? []}
                        error={
                          errors?.variationProducts?.[index]?.size?.message
                        }
                        loading={sizeLoading}
                        labelKey="size"
                        valueKey="size"
                        noneOption={true}
                      />
                    </InputWrapper>

                    {/* REGION */}
                    <InputWrapper
                      label={"Region"}
                      labelFor={`variationProducts.${index}.region`}
                      error={
                        errors?.variationProducts?.[index]?.region?.message
                      }
                    >
                      <SearchableSelect
                        label={"Region"}
                        labelFor="region_select"
                        value={watch(`variationProducts.${index}.region`) ?? ""}
                        onValueChange={(value: string) => {
                          setValue(
                            `variationProducts.${index}.region`,
                            value === "none" ? undefined : value
                          );
                        }}
                        options={regionList?.data ?? []}
                        error={
                          errors?.variationProducts?.[index]?.region?.message
                        }
                        loading={regionLoading}
                        labelKey="region"
                        valueKey="region"
                        noneOption={true}
                      />
                    </InputWrapper>

                    {/* Chipset Selection with Search */}
                    <InputWrapper
                      label={"Chipset"}
                      labelFor={`variationProducts.${index}.chipset`}
                      error={
                        errors?.variationProducts?.[index]?.chipset?.message
                      }
                    >
                      <SearchableSelect
                        label={"Chipset"}
                        labelFor="chipset_select"
                        value={
                          watch(`variationProducts.${index}.chipset`) ?? ""
                        }
                        onValueChange={(value: string) => {
                          setValue(
                            `variationProducts.${index}.chipset`,
                            value === "none" ? undefined : value
                          );
                        }}
                        options={chipsetList?.data ?? []}
                        error={
                          errors?.variationProducts?.[index]?.chipset?.message
                        }
                        loading={chipsetLoading}
                        labelKey="chipset"
                        valueKey="chipset"
                        noneOption={true}
                      />
                    </InputWrapper>
                    {/* Material Selection with Search */}
                    <InputWrapper
                      label={"Material"}
                      labelFor={`variationProducts.${index}.strapMaterial`}
                      error={
                        errors?.variationProducts?.[index]?.strapMaterial
                          ?.message
                      }
                    >
                      <SearchableSelect
                        label={"Strap Material"}
                        labelFor="strapMaterial_select"
                        value={
                          watch(`variationProducts.${index}.strapMaterial`) ??
                          ""
                        }
                        onValueChange={(value: string) => {
                          setValue(
                            `variationProducts.${index}.strapMaterial`,
                            value === "none" ? undefined : value
                          );
                        }}
                        options={strapMaterialList?.data ?? []}
                        error={
                          errors?.variationProducts?.[index]?.strapMaterial
                            ?.message
                        }
                        loading={strapMaterialLoading}
                        labelKey="name"
                        valueKey="name"
                        noneOption={true}
                      />
                    </InputWrapper>
                    {/* Connectivity Selection with Search */}
                    <InputWrapper
                      label={"Connectivity"}
                      labelFor={`variationProducts.${index}.connectivity`}
                      error={
                        errors?.variationProducts?.[index]?.connectivity
                          ?.message
                      }
                    >
                      <SearchableSelect
                        label={"Connectivity"}
                        labelFor="connectivity_select"
                        value={
                          watch(`variationProducts.${index}.connectivity`) ?? ""
                        }
                        onValueChange={(value: string) => {
                          setValue(
                            `variationProducts.${index}.connectivity`,
                            value === "none" ? undefined : value
                          );
                        }}
                        options={connectivityList?.data ?? []}
                        error={
                          errors?.variationProducts?.[index]?.connectivity
                            ?.message
                        }
                        loading={connectivityLoading}
                        labelKey="name"
                        valueKey="name"
                        noneOption={true}
                      />
                    </InputWrapper>
                    {/* Connector Selection with Search */}
                    <InputWrapper
                      label={"Connector"}
                      labelFor={`variationProducts.${index}.connectorType`}
                      error={
                        errors?.variationProducts?.[index]?.connectorType
                          ?.message
                      }
                    >
                      <SearchableSelect
                        label={"Connector Type"}
                        labelFor="connectorType_select"
                        value={
                          watch(`variationProducts.${index}.connectorType`) ??
                          ""
                        }
                        onValueChange={(value: string) => {
                          setValue(
                            `variationProducts.${index}.connectorType`,
                            value === "none" ? undefined : value
                          );
                        }}
                        options={connectorList?.data ?? []}
                        error={
                          errors?.variationProducts?.[index]?.connectorType
                            ?.message
                        }
                        loading={connectorLoading}
                        labelKey="name"
                        valueKey="name"
                        noneOption={true}
                      />
                    </InputWrapper>
                    {/* Connector Selection with Search */}
                    <InputWrapper
                      label={"Plug"}
                      labelFor={`variationProducts.${index}.plugType`}
                      error={
                        errors?.variationProducts?.[index]?.plugType?.message
                      }
                    >
                      <SearchableSelect
                        label={"Plug Type"}
                        labelFor="plugType_select"
                        value={
                          watch(`variationProducts.${index}.plugType`) ?? ""
                        }
                        onValueChange={(value: string) => {
                          setValue(
                            `variationProducts.${index}.plugType`,
                            value === "none" ? undefined : value
                          );
                        }}
                        options={plugList?.data ?? []}
                        error={
                          errors?.variationProducts?.[index]?.plugType?.message
                        }
                        loading={plugLoading}
                        labelKey="name"
                        valueKey="name"
                        noneOption={true}
                      />
                    </InputWrapper>
                    {/* regular warranty */}
                    <InputWrapper
                      label={"Regular Warranty"}
                      labelFor={`variationProducts.${index}.regularWarrantyId`}
                      error={
                        errors?.variationProducts?.[index]?.regularWarrantyId
                          ?.message
                      }
                    >
                      <SearchableSelect
                        label={"Regular Warranty"}
                        labelFor="regularWarranty_select"
                        value={watch(
                          `variationProducts.${index}.regularWarrantyId`
                        )?.toString()}
                        onValueChange={(value: string) => {
                          setValue(
                            `variationProducts.${index}.regularWarrantyId`,
                            value === "none" ? undefined : +value
                          );
                        }}
                        options={regularWarrantyList?.data ?? []}
                        error={
                          errors?.variationProducts?.[index]?.regularWarrantyId
                            ?.message
                        }
                        loading={regularWarrantyLoading}
                        labelKey="name"
                        noneOption={true}
                      />
                    </InputWrapper>

                    {/* Price */}
                    <InputWrapper
                      label="Price"
                      labelFor={`variationProducts.${index}.price`}
                      error={errors?.variationProducts?.[index]?.price?.message}
                      className="w-full"
                    >
                      <input
                        type="text"
                        placeholder="Enter Price"
                        className="border border-gray-500 pl-3 py-1.5 rounded-md text-gray-700 focus:outline-none focus:ring-2"
                        value={watch(`variationProducts.${index}.price`) || 0}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Allow only numbers or empty value for the price field
                          if (/^[0-9]*$/.test(value)) {
                            setValue(
                              `variationProducts.${index}.price`,
                              Number(value || 0),
                              {
                                shouldValidate: true,
                              }
                            );
                          }
                        }}
                      />
                    </InputWrapper>

                    {/* Discount Price */}
                    <InputWrapper
                      label="Discount Price"
                      labelFor={`variationProducts.${index}.discountPrice`}
                      error={
                        errors?.variationProducts?.[index]?.discountPrice
                          ?.message
                      }
                      className="w-full"
                    >
                      <input
                        type="text"
                        {...register(
                          `variationProducts.${index}.discountPrice`,
                          {
                            valueAsNumber: true, // Convert input value to a number
                          }
                        )}
                        placeholder="Enter Discount Price"
                        className="border border-gray-500 pl-3 py-1.5 rounded-md text-gray-700 focus:outline-none focus:ring-2"
                        onChange={(e) => {
                          const value = e.target.value;
                          setValue(
                            `variationProducts.${index}.discountPrice`,
                            value === "" ? 0 : Number(value), // Ensure number or 0
                            { shouldValidate: true }
                          );
                        }}
                        value={
                          watch(`variationProducts.${index}.discountPrice`) ?? 0
                        } // Prevent NaN issue
                      />
                    </InputWrapper>
                    <InputWrapper
                      label="Pre-discount Price"
                      labelFor={`variationProducts.${index}.preDiscountPrice`}
                      error={
                        errors?.variationProducts?.[index]?.preDiscountPrice
                          ?.message
                      }
                      className="w-full"
                    >
                      <input
                        type="text"
                        {...register(
                          `variationProducts.${index}.preDiscountPrice`,
                          {
                            valueAsNumber: true, // Convert input value to a number
                          }
                        )}
                        placeholder="Enter Pre Discount Price"
                        className="border border-gray-500 pl-3 py-1.5 rounded-md text-gray-700 focus:outline-none focus:ring-2"
                        onChange={(e) => {
                          const value = e.target.value;
                          setValue(
                            `variationProducts.${index}.preDiscountPrice`,
                            value === "" ? 0 : Number(value), // Ensure number or 0
                            { shouldValidate: true }
                          );
                        }}
                        value={
                          watch(
                            `variationProducts.${index}.preDiscountPrice`
                          ) ?? 0
                        } // Prevent NaN issue
                      />
                    </InputWrapper>
                    <InputWrapper
                      label="Start Date"
                      labelFor={`variationProducts.${index}.startDate`}
                      error={
                        errors?.variationProducts?.[index]?.startDate?.message
                      }
                      className="w-full"
                    >
                      <Controller
                        name={`variationProducts.${index}.startDate`}
                        control={control}
                        render={({ field }) => (
                          <DateTimeInput
                            name={field.name}
                            register={register}
                            watch={watch}
                            setValue={setValue}
                          />
                        )}
                      />
                    </InputWrapper>
                    <InputWrapper
                      label="End Date"
                      labelFor={`variationProducts.${index}.endDate`}
                      error={
                        errors?.variationProducts?.[index]?.endDate?.message
                      }
                      className="w-full"
                    >
                      <Controller
                        name={`variationProducts.${index}.endDate`}
                        control={control}
                        render={({ field }) => (
                          <DateTimeInput
                            name={field.name}
                            register={register}
                            watch={watch}
                            setValue={setValue}
                          />
                        )}
                      />
                    </InputWrapper>

                    {/* Booking Price */}
                    <InputWrapper
                      label="Booking Price"
                      labelFor={`variationProducts.${index}.bookingPrice`}
                      error={
                        errors?.variationProducts?.[index]?.bookingPrice
                          ?.message
                      }
                      className="w-full"
                    >
                      <input
                        type="text"
                        {...register(
                          `variationProducts.${index}.bookingPrice`,
                          {
                            valueAsNumber: true, // Convert input value to a number
                          }
                        )}
                        placeholder="Enter Booking Price"
                        className="border border-gray-500 pl-3 py-1.5 rounded-md text-gray-700 focus:outline-none focus:ring-2"
                        onChange={(e) => {
                          const value = e.target.value;
                          setValue(
                            `variationProducts.${index}.bookingPrice`,
                            value === "" ? 0 : Number(value), // Ensure number or 0
                            { shouldValidate: true }
                          );
                        }}
                        value={
                          watch(`variationProducts.${index}.bookingPrice`) ?? 0
                        } // Prevent NaN issue
                      />
                    </InputWrapper>

                    {/* Purchase Point */}
                    <InputWrapper
                      label="Purchase Point"
                      labelFor={`variationProducts.${index}.purchasePoint`}
                      error={
                        errors?.variationProducts?.[index]?.purchasePoint
                          ?.message
                      }
                      className="w-full"
                    >
                      <input
                        type="text"
                        {...register(
                          `variationProducts.${index}.purchasePoint`,
                          {
                            valueAsNumber: true,
                          }
                        )}
                        placeholder="Enter Purchase Point"
                        className="border border-gray-500 pl-3 py-1.5 rounded-md text-gray-700 focus:outline-none focus:ring-2"
                        onChange={(e) => {
                          const value = e.target.value;
                          setValue(
                            `variationProducts.${index}.purchasePoint`,
                            value === "" ? 0 : Number(value), // Ensure number or 0
                            { shouldValidate: true }
                          );
                        }}
                        value={
                          watch(`variationProducts.${index}.purchasePoint`) ?? 0
                        } // Prevent NaN issue
                      />
                    </InputWrapper>

                    <div className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        {...register(
                          `variationProducts.${index}.isShippedFree`
                        )}
                      />
                      <span className="text-base font-semibold">
                        Is shipped free?
                      </span>
                    </div>
                  </SectionWrapper>
                  <div className="grid grid-cols-1 lg:grid-cols-8 mt-5 px-5">
                    <div className="col-span-1 lg:col-span-5 items-center">
                      {watch(`variationProducts.${index}.colors`)?.map(
                        (_, colorIndex) => (
                          <div
                            key={colorIndex}
                            className="flex items-center gap-2"
                          >
                            <InputWrapper
                              label="Color ✽"
                              labelFor={`variationProducts.${index}.colors.${colorIndex}.colorId`}
                              error={
                                errors?.variationProducts?.[index]?.colors?.[
                                  colorIndex
                                ]?.colorId?.message
                              }
                              className="w-44"
                            >
                              <SearchableSelect
                                label={"Color"}
                                labelFor="color_select"
                                value={
                                  watch(
                                    `variationProducts.${index}.colors.${colorIndex}.colorId`
                                  )?.toString() || ""
                                }
                                onValueChange={(value: string) => {
                                  setValue(
                                    `variationProducts.${index}.colors.${colorIndex}.colorId`,
                                    parseInt(value, 10)
                                  );
                                }}
                                options={colorList?.data ?? []}
                                error={
                                  errors?.variationProducts?.[index]?.colors?.[
                                    colorIndex
                                  ]?.colorId?.message
                                }
                                loading={colorLoading}
                                labelKey="color"
                              />
                            </InputWrapper>
                            <InputWrapper
                              label="Color Price"
                              labelFor={`variationProducts.${index}.colors.${colorIndex}.price`}
                              error={
                                errors?.variationProducts?.[index]?.colors?.[
                                  colorIndex
                                ]?.price?.message
                              }
                              className="w-[100px] "
                            >
                              <input
                                type="text"
                                placeholder="Enter Price"
                                className="border border-gray-500 pl-3 py-1.5 rounded-md text-gray-700 focus:outline-none focus:ring-2"
                                value={
                                  watch(
                                    `variationProducts.${index}.colors.${colorIndex}.price`
                                  ) || 0
                                }
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // Allow only numbers or empty value for the price field
                                  if (/^[0-9]*$/.test(value)) {
                                    setValue(
                                      `variationProducts.${index}.colors.${colorIndex}.price`,
                                      Number(value || 0),
                                      {
                                        shouldValidate: true,
                                      }
                                    );
                                  }
                                }}
                              />
                            </InputWrapper>
                            <InputWrapper
                              label="Stock"
                              labelFor={`variationProducts.${index}.colors.${colorIndex}.price`}
                              error={
                                errors?.variationProducts?.[index]?.colors?.[
                                  colorIndex
                                ]?.stock?.message
                              }
                              className="w-[100px]"
                            >
                              <input
                                type="text"
                                placeholder="Enter stock"
                                className="border border-gray-500 pl-3 py-1.5 rounded-md text-gray-700 focus:outline-none focus:ring-2"
                                value={
                                  watch(
                                    `variationProducts.${index}.colors.${colorIndex}.stock`
                                  ) || 0
                                }
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // Allow only numbers or empty value for the price field
                                  if (/^[0-9]*$/.test(value)) {
                                    setValue(
                                      `variationProducts.${index}.colors.${colorIndex}.stock`,
                                      Number(value || 0),
                                      {
                                        shouldValidate: true,
                                      }
                                    );
                                  }
                                }}
                              />
                            </InputWrapper>
                            <div className="mt-4 flex items-center gap-1">
                              <input
                                type="checkbox"
                                {...register(
                                  `variationProducts.${index}.colors.${colorIndex}.inStock`
                                )}
                              />
                              <span>In Stock</span>
                            </div>

                            <div className="flex items-center gap-2 mt-4">
                              {watch(`variationProducts.${index}.colors`)
                                .length > 1 && (
                                <button
                                  className="text-red-500 hover:text-red-700 font-medium text-sm"
                                  type="button"
                                  onClick={() => removeColor(index, colorIndex)}
                                >
                                  <MinusIcon />
                                </button>
                              )}
                              <button
                                className=" text-sm rounded-md transition"
                                type="button"
                                onClick={() => addColor(index)}
                              >
                                <Plus />
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    {/* Dynamic Extra Warranty */}
                    <div className="col-span-1 lg:col-span-3 mt-3">
                      <label>Extra Warranty</label>
                      {watch(`variationProducts.${index}.extraWarranty`)?.map(
                        (_, warrantyIndex) => (
                          <div
                            key={warrantyIndex}
                            className="flex items-center gap-2"
                          >
                            <InputWrapper
                              label={""}
                              labelFor={`variationProducts.${index}.extraWarranty.${warrantyIndex}.name`}
                              error={
                                errors?.variationProducts?.[index]
                                  ?.extraWarranty?.[warrantyIndex]?.name
                                  ?.message
                              }
                            >
                              <SearchableSelect
                                label={"Extra warranty"}
                                labelFor="warranty_select"
                                value={
                                  watch(
                                    `variationProducts.${index}.extraWarranty.${warrantyIndex}.name`
                                  ) ?? ""
                                }
                                onValueChange={(value: string) => {
                                  setValue(
                                    `variationProducts.${index}.extraWarranty.${warrantyIndex}.name`,
                                    value === "none" ? undefined : value
                                  );
                                }}
                                options={warrantyList?.data ?? []}
                                error={
                                  errors?.variationProducts?.[index]
                                    ?.extraWarranty?.[warrantyIndex]?.name
                                    ?.message
                                }
                                loading={warrantyLoading}
                                labelKey="name"
                                valueKey="name"
                                noneOption={true}
                              />
                            </InputWrapper>

                            <input
                              className="border border-gray-500 pl-3 py-1.5  w-24 rounded-md text-gray-700 focus:outline-none focus:ring-2"
                              type="text"
                              placeholder="Price"
                              value={
                                watch(
                                  `variationProducts.${index}.extraWarranty.${warrantyIndex}.price`
                                ) || "" // If there's no value, use an empty string
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^[0-9]*\.?[0-9]{0,2}$/.test(value)) {
                                  // Allow only numbers and up to 2 decimals
                                  setValue(
                                    `variationProducts.${index}.extraWarranty.${warrantyIndex}.price`,
                                    Number(value)
                                  );
                                }
                              }}
                            />

                            <div className="flex items-center gap-2">
                              {watch(`variationProducts.${index}.extraWarranty`)
                                .length > 1 && (
                                <button
                                  className="text-red-500 hover:text-red-700 font-medium text-sm"
                                  type="button"
                                  onClick={() =>
                                    removeWarranty(index, warrantyIndex)
                                  }
                                >
                                  <MinusIcon />
                                </button>
                              )}
                              <button
                                className=" text-sm rounded-md transition"
                                type="button"
                                onClick={() => addWarranty(index)}
                              >
                                <Plus />
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Remove Variation Button */}
                  <div className="mb-5">
                    {variationFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariation(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md mt-8"
                      >
                        <Minus />
                      </button>
                    )}
                  </div>
                </div>
              ))}

            {/* Add Variation Product Button */}
            <div className="">
              <button
                type="button"
                onClick={handleAddVariation}
                className="px-4 ml-4 mt-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add Variation Product
              </button>
            </div>
          </SectionWrapper>

          <div className="grid grid-cols-2 border border-primary p-4 rounded-md">
            {/* HIGHLIGHT ACCESSORIES */}
            <SectionWrapper className="px-4 py-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Highlight Products
              </label>

              {accessoryFields.map((item, index) => {
                // Filter products based on search query
                // const filteredProducts = products?.data?.filter((product) =>
                //   product.productName
                //     .toLowerCase()
                //     .includes(searchQuery.highlightAccessories?.toLowerCase())
                // );

                return (
                  <div
                    key={item.id}
                    className="min-w-full flex items-center gap-2"
                  >
                    {/* Select Dropdown */}
                    <div className="min-w-80 mt-4">
                      <SearchableSelect
                        label={"Highlight Product"}
                        labelFor="product_select"
                        onValueChange={(value) => {
                          handleProductSelect(value, index);
                        }}
                        value={
                          watch(`highlightAccessories.${index}`)?.toString() ||
                          ""
                        }
                        options={products?.data ?? []}
                        loading={productLoading}
                        labelKey="productName"
                        noneOption={true}
                      />
                    </div>

                    {/* <Select
                      
                    >
                      <SelectTrigger className="w-full border rounded px-4 py">
                        <SelectValue placeholder="Select Product" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="p-2">
                          <input
                            type="text"
                            placeholder="Search Product..."
                            value={searchQuery.highlightAccessories}
                            onChange={(e) =>
                              handleSearchChange(
                                "highlightAccessories",
                                e.target.value
                              )
                            }
                            onKeyDown={handleInputKeyDown}
                            ref={searchInputRef}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder-gray-400 bg-white shadow-sm"
                            autoFocus
                          />
                        </div>
                        {filteredProducts?.map((product) => (
                          <SelectItem
                            key={product.id}
                            value={product.id.toString()}
                          >
                            {product.productName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select> */}

                    {/* Remove Button (Only if more than 1 field exists) */}
                    <div className="flex items-center gap-1 -mt-5">
                      {accessoryFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(index)}
                          className="text-red-500 hover:text-red-700 font-medium text-sm pr-2"
                        >
                          <Minus />
                        </button>
                      )}
                      {/* Add Accessory Button */}
                      <div className="flex justify-end">
                        <button type="button" onClick={handleAppendProduct}>
                          <Plus />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </SectionWrapper>

            {/* FEATURE */}
            <SectionWrapper className="w-full">
              {/* Features Section */}
              {fields.map((field: any, index: any) => (
                <SectionWrapper
                  key={field.id}
                  className="flex flex-col gap-4 w-full"
                >
                  <div className="flex gap-2 items-end">
                    {/* Feature Key */}
                    <InputWrapper
                      label={ADD_EDIT_PRODUCT_FORM.features.label}
                      labelFor={`features.${index}.featureKeyId`}
                      error={errors?.features?.[index]?.featureKeyId?.message}
                    >
                      <SearchableSelect
                        label={"Features"}
                        labelFor="features_select"
                        value={watch(
                          `features.${index}.featureKeyId`
                        )?.toString()}
                        onValueChange={(value: string) => {
                          setValue(
                            `features.${index}.featureKeyId`,
                            value === "none" ? undefined : +value
                          );
                        }}
                        options={features?.data ?? []}
                        error={errors?.features?.[index]?.featureKeyId?.message}
                        loading={featureLoading}
                        labelKey="name"
                        noneOption={true}
                      />
                    </InputWrapper>

                    {/* Feature Value */}
                    <InputWrapper
                      label="Attribute Value"
                      labelFor={`features.${index}.value`}
                      error={errors?.features?.[index]?.value?.message}
                    >
                      <input
                        className="py-2 pl-2 w-full rounded-md border focus:border-primary"
                        {...register(`features.${index}.value`)}
                        type="text"
                        placeholder="Enter attribute value"
                      />
                    </InputWrapper>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="px-4 py-2 mb-1.5 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        <Minus />
                      </button>
                    )}
                  </div>
                </SectionWrapper>
              ))}

              {/* Add Feature Button */}
              <div className="mt-2 mr-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => append({ featureKeyId: 0, value: "" })}
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ml-4"
                >
                  <Plus />
                </button>
              </div>
            </SectionWrapper>
          </div>

          {/* IMAGES */}
          <SectionWrapper className="border border-primary p-4 rounded-md mt-5">
            {/* Images Section */}
            {imagesFields.map((field: any, index: any) => {
              const selectedColor = watch(`images.${index}.colorId`); // Get selected color

              return (
                <SectionWrapper key={field.id} className="flex flex-col gap-4">
                  <div className="flex gap-2 items-center">
                    {/* Color Selection */}
                    <InputWrapper
                      label="Color ✽"
                      labelFor={`images.${index}.colorId`}
                      error={errors?.images?.[index]?.colorId?.message}
                      className="w-full -mt-9"
                    >
                      <div className="p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Color
                        </label>

                        <SearchableSelect
                          label={"Ram"}
                          labelFor="ram_select"
                          value={selectedColor?.toString()}
                          onValueChange={(value: string) => {
                            setValue(`images.${index}.colorId`, +value);

                            setError(`images.${index}.colorId`, {
                              type: "custom",
                              message: "",
                            });
                          }}
                          options={colorList?.data ?? []}
                          error={errors?.images?.[index]?.colorId?.message}
                          loading={colorLoading}
                          labelKey="color"
                        />
                      </div>
                    </InputWrapper>

                    {/* Image Upload (Disabled if No Color Selected) */}

                    <InputWrapper label={ADD_EDIT_PRODUCT_FORM.images.label}>
                      <div className="relative flex items-center gap-2 w-full">
                        <FileInput
                          onChange={(selectedFiles) => {
                            if (selectedFiles[0]) {
                              setFiles((prev) => ({
                                ...prev,
                                [index]: selectedFiles[0],
                              }));
                            } else {
                              setFiles((prev) => {
                                const updatedFiles = { ...prev };
                                delete updatedFiles[index];
                                return updatedFiles;
                              });
                            }
                          }}
                          currentFile={files[index]}
                          actionItem={{
                            ProductImage: [
                              { imageUrl: watch(`images.${index}.imageUrl`) },
                            ],
                          }}
                          placeholder="Choose an image"
                          required={false}
                          id="image"
                          index={index}
                          className="mt-2"
                          disabled={!selectedColor}
                          onRemove={() => {
                            setValue(`images.${index}.imageUrl`, "");
                          }}
                          onGalleryClick={() => openGalleryForIndex(index)}
                        />

                        {/* Show loader or checkmark based on the loading state */}
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          {uploadingImages[index] ? (
                            <Loader2
                              className="animate-spin text-blue-500"
                              size={20}
                            />
                          ) : watch(`images.${index}.imageUrl`) ? (
                            <CheckCircle className="text-green-500" size={20} />
                          ) : null}
                        </div>
                      </div>
                    </InputWrapper>
                    <div className="p-2">
                      <label htmlFor="">{"Alt text"}</label>
                      <input
                        placeholder={"Enter alt text"}
                        value={altTexts[index] || ""}
                        onChange={(e) =>
                          setAltTexts((prev) => ({
                            ...prev,
                            [index]: e.target.value,
                          }))
                        }
                        className="w-60 border-2 border-gray-400 p-2 rounded-md"
                      />
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <Dialog open={openModal} onOpenChange={setOpenModal}>
                        {/* <DialogTrigger asChild>
                          <Button type="button" size="sm">
                            <GalleryHorizontal className="w-4 h-4" />
                          </Button>
                        </DialogTrigger> */}

                        <DialogContent className="max-h-[80vh] overflow-hidden overflow-y-auto sm:min-w-[1200px]">
                          <div className="flex justify-between items-center bg-white px-4 rounded-lg">
                            <div className="relative w-1/3 mx-auto my-4">
                              <input
                                type="text"
                                placeholder="Search images..."
                                className="pl-10 border rounded-md px-3 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchGallery}
                                onChange={(e) =>
                                  setSearchGallery(e.target.value)
                                }
                              />
                              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                          </div>

                          <div>
                            {filteredGalleries.length > 0 ? (
                              galleryLoading ? (
                                <div className="flex justify-center mt-10">
                                  <ButtonLoader />
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                                  {filteredGalleries.map((gallery) => (
                                    <div>
                                      <button
                                        type="button"
                                        key={gallery.key} // Using key as the unique identifier
                                        onClick={() =>
                                          handleImageSelect(
                                            currentImageIndex,
                                            gallery.url
                                          )
                                        }
                                        className="border p-2 hover:bg-gray-100"
                                      >
                                        <img
                                          src={gallery.url}
                                          alt={
                                            gallery.key.split("/").pop() ||
                                            "Gallery image"
                                          } // Use filename as alt text
                                          className="w-28 h-24 object-contain object-center"
                                        />
                                      </button>
                                      <Paragraph>
                                        {extractAltText(gallery.url)}
                                      </Paragraph>
                                    </div>
                                  ))}
                                </div>
                              )
                            ) : (
                              <p className="text-sm text-center font-semibold text-primary">
                                {searchGallery
                                  ? "No images found"
                                  : "Start typing to search image"}
                              </p>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="mt-7">
                      <Button
                        variant={"outline"}
                        size="sm"
                        type="button"
                        onClick={() => {
                          if (files[index]) {
                            handleAddImage(index, files[index]);
                          } else if (watch(`images.${index}.imageUrl`)) {
                            toast.success("Image already added");
                          } else {
                            toast.error(
                              "Please select an image before adding."
                            );
                          }
                        }}
                        disabled={
                          !files[index] && !watch(`images.${index}.imageUrl`)
                        }
                      >
                        {watch(`images.${index}.imageUrl`) ? (
                          <>
                            <span className="text-green-600">Added</span>
                          </>
                        ) : (
                          <>
                            <span className="text-red-600">Add</span>
                          </>
                        )}
                      </Button>
                    </div>
                    {/* Remove Button (If More Than One Image Field Exists) */}
                    {imagesFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImages(index)}
                        className="px-4 mt-9 py-2 mb-1.5 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        <Minus />
                      </button>
                    )}
                  </div>
                </SectionWrapper>
              );
            })}

            {/* Add Image Button */}
            <div className="mt-2 mr-3 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  // const lastIndex = imagesFields.length - 1;
                  // const lastColor = watch(`images.${lastIndex}.colorId`);
                  // const lastImageUrl = watch(`images.${lastIndex}.imageUrl`);
                  // const lastHasFile = files[lastIndex] || lastImageUrl;

                  // if (!lastColor || !lastHasFile) {
                  //   toast.error(
                  //     "Please select a color and image for the current field before adding another."
                  //   );
                  //   return;
                  // }
                  appendImages({ colorId: 0, imageUrl: "" });
                }}
                // disabled={
                //   !watch(`images.${imagesFields.length - 1}.colorId`) ||
                //   !(
                //     files[imagesFields.length - 1] ||
                //     watch(`images.${imagesFields.length - 1}.imageUrl`)
                //   )
                // }
                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ml-4"
              >
                <Plus />
              </button>
            </div>
          </SectionWrapper>
        </div>
        <SectionWrapper className="border border-primary p-4 rounded-md mt-5">
          {/* <Description  control={control} errors={errors}/> */}
          <Accordion type="single" collapsible className="w-full">
            {/* In the Box Section */}
            <AccordionItem value="in-box">
              <AccordionTrigger className="text-2xl">
                In the Box
              </AccordionTrigger>
              <AccordionContent>
                <Controller
                  name="inBox"
                  control={control}
                  render={({ field }) => (
                    <TipTapEditor
                      content={field.value}
                      onUpdate={field.onChange}
                    />
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Short Description Section */}
            <AccordionItem value="short-description">
              <AccordionTrigger className="text-2xl">
                Short Description
              </AccordionTrigger>
              <AccordionContent>
                <Controller
                  name="sortDescription"
                  control={control}
                  render={({ field }) => (
                    <TipTapEditor
                      content={field.value}
                      onUpdate={field.onChange}
                    />
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="mt-10">
            <p className="block text-3xl">Specification</p>
            <Controller
              name="specification"
              control={control}
              render={({ field }) => (
                <TipTapEditor content={field.value} onUpdate={field.onChange} />
              )}
            />
          </div>
          <div className="mt-10">
            <p className="block text-3xl">Description</p>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TipTapEditor content={field.value} onUpdate={field.onChange} />
              )}
            />
          </div>
        </SectionWrapper>

        <div className="flex justify-end my-5">
          <div className="flex justify-between items-center gap-2">
            {/* <button
              type="button"
              onClick={handleSaveDraft}
              className="px-4 py-1 font-sisEmibold rounded border text-blue-500 mr-2"
            >
              Save Draft
            </button> */}
            {error && "data" in error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Add Product error</AlertTitle>
                <AlertDescription>
                  {(error.data as { message?: string })?.message ||
                    "Something went wrong! Please try again."}
                </AlertDescription>
              </Alert>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleHold}
                className="px-4 py-1 bg-gray-500 text-white font-semiBold rounded hover:bg-gray-600"
              >
                Hold
              </button>
              <button
                type="submit"
                className="px-4 flex items-center py-1 bg-blue-500 text-white font-sisEmibold rounded hover:bg-blue-600"
              >
                {addProductLoading && <ButtonLoader />}
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </PageWrapper>
  );
};

export default AddProduct;
