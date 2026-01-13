import InputWrapper from "@/components/common/wrapper/InputWrapper";
import Input from "@/components/ui/input";
import { useEffect, useState } from "react";
import SearchableSelect from "@/pages/dashboard/products/SearchableSelect";
import { FaStarOfLife } from "react-icons/fa";
import {
  useGetPathaoCitiesQuery,
  useGetPathaoZonesQuery,
  useGetPathaoAreasQuery,
} from "@/components/store/api/shippingAddressApi";
import { useGetSingleOrderQuery } from "@/components/store/api/order/orderApi";
import { useParams } from "react-router-dom";

interface City {
  city_id: number;
  city_name: string;
}

interface Zone {
  zone_id: number;
  zone_name: string;
}

interface Area {
  area_id: number;
  area_name: string;
}

interface CreateOrderAddressProps {
  errors: any;
  setValue: any;
  watch: any;
  setSelectedDistrict?: (district: string) => void;
}


const CreateOrderAddress = ({ errors, setValue, watch, setSelectedDistrict }: CreateOrderAddressProps) => {
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // API hooks
  const { data: pathaoCities } = useGetPathaoCitiesQuery(undefined);
  const { data: zones } = useGetPathaoZonesQuery(selectedCityId!, { skip: !selectedCityId });
  const { data: areas } = useGetPathaoAreasQuery(selectedZoneId!, { skip: !selectedZoneId });

  const cities: City[] = pathaoCities?.data?.data?.data || [];
  const zoneList: Zone[] = zones?.data?.data?.data || [];
  const areaList: Area[] = areas?.data?.data?.data || [];

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow only numbers and + sign, ensure it starts with +880
    if (/[^0-9+]/.test(value)) {
      return;
    }

    // Remove non-digit characters except for the leading +880
    // if (value.length > 4 && value[4] === "0") {
    //   value = value.slice(5); // Ensure no leading 0 after +880
    // }

    // Limit the phone number length to 11 digits (including +880)
    if (value.length <= 14) {
      setValue("shippingAddress.0.phone", value);
    }
  };

  // useEffect(() => {
  //   setValue("shippingAddress.0.phone", phone);
  // }, [phone, setValue]);

  // Initialize form with existing values if they exist
  useEffect(() => {
    if (cities.length > 0) {
      const shippingAddress = watch("shippingAddress.0");
      if (shippingAddress?.cityId) {
        setSelectedCityId(shippingAddress.cityId);
        setSelectedZoneId(shippingAddress.zoneId);
      }
      setLoading(false);
    }
  }, [cities, watch]);

  const handleCityChange = (cityId: number, cityName: string) => {
    setSelectedCityId(cityId);
    setSelectedZoneId(null);
    setValue("shippingAddress.0.cityId", cityId);
    setValue("shippingAddress.0.city", cityName);
    setValue("shippingAddress.0.zoneId", null);
    setValue("shippingAddress.0.zone", "");
    setValue("shippingAddress.0.areaId", null);
    setValue("shippingAddress.0.area", "");
    
    // Update the district in parent component when city changes
    if (setSelectedDistrict) {
      setSelectedDistrict(cityName);
    }
  };
    const { id } = useParams();
  const { data: singleOrder } =
    useGetSingleOrderQuery(id);
  useEffect(() => {
    if (singleOrder?.data) {
      const info = singleOrder.data.OrderShippingInfo[0];
      console.log(info?.phone)

      setValue("shippingAddress.0.phone", info?.phone);

    }
  }, [singleOrder?.data, setValue]);

  const handleZoneChange = (zoneId: number, zoneName: string) => {
    setSelectedZoneId(zoneId);
    setValue("shippingAddress.0.zoneId", zoneId);
    setValue("shippingAddress.0.zone", zoneName);
    setValue("shippingAddress.0.areaId", null);
    setValue("shippingAddress.0.area", "");
  };

  const handleAreaChange = (areaId: number, areaName: string) => {
    setValue("shippingAddress.0.areaId", areaId);
    setValue("shippingAddress.0.area", areaName);
  };

  if (loading) {
    return <div>Loading address data...</div>;
  }

  return (
    <>
      {/* Name Input */}
      <InputWrapper
        label=""
        labelFor="shippingAddress.0.name"
        error={errors?.shippingAddress?.[0]?.name?.message}
      >
        <div className="flex items-center gap-2 mb-1">
          <label className="text-sm font-medium">Name</label>
          <FaStarOfLife className="h-2 w-2 text-muted-foreground text-red-500" />
        </div>
        <Input
          placeholder="Name"
          value={watch("shippingAddress.0.name") || ""}
          onChange={(e) => setValue("shippingAddress.0.name", e.target.value)}
          errorMessage={errors?.shippingAddress?.[0]?.name?.message}
        />
      </InputWrapper>

      {/* Phone Input */}
      <InputWrapper
        label=""
        labelFor="shippingAddress.0.phone"
        error={errors?.shippingAddress?.[0]?.phone?.message}
      >
        <div className="flex items-center gap-2 mb-1">
          <label className="text-sm font-medium">Phone</label>
          <FaStarOfLife className="h-2 w-2 text-muted-foreground text-red-500" />
        </div>
        <Input
          placeholder="Phone"
          value={watch("shippingAddress.0.phone") || ""}
          onChange={(e) => handlePhoneChange(e)}
          errorMessage={errors?.shippingAddress?.[0]?.phone?.message}
        />
      </InputWrapper>

      {/* City Select */}
      <InputWrapper
        label=""
        labelFor="shippingAddress.0.city"
        error={errors?.shippingAddress?.[0]?.city?.message}
      >
        <div className="flex items-center gap-2 mb-1">
          <label className="text-sm font-medium">City</label>
          <FaStarOfLife className="h-2 w-2 text-muted-foreground text-red-500" />
        </div>
        <SearchableSelect
          label="City"
          labelFor="city"
          value={watch("shippingAddress.0.cityId")?.toString() || ""}
          onValueChange={(value: string) => {
            const city = cities.find(c => c.city_id.toString() === value);
            if (city) {
              handleCityChange(city.city_id, city.city_name);
            }
          }}
          options={cities.map(city => ({
            id: city.city_id,
            name: city.city_name
          }))}
          error={errors?.shippingAddress?.[0]?.city?.message}
          labelKey="name"
          valueKey="id"
        />
      </InputWrapper>

      {/* Zone Select */}
      <InputWrapper
        label=""
        labelFor="shippingAddress.0.zone"
        error={errors?.shippingAddress?.[0]?.zone?.message}
      >
        <div className="flex items-center gap-2 mb-1">
          <label className="text-sm font-medium">Zone</label>
          <FaStarOfLife className="h-2 w-2 text-muted-foreground text-red-500" />
        </div>
        <SearchableSelect
          label="Zone"
          labelFor="zone"
          value={watch("shippingAddress.0.zoneId")?.toString() || ""}
          onValueChange={(value: string) => {
            const zone = zoneList.find(z => z.zone_id.toString() === value);
            if (zone) {
              handleZoneChange(zone.zone_id, zone.zone_name);
            }
          }}
          options={zoneList.map(zone => ({
            id: zone.zone_id,
            name: zone.zone_name
          }))}
          error={errors?.shippingAddress?.[0]?.zone?.message}
          labelKey="name"
          valueKey="id"
          disabled={!selectedCityId}
        />
      </InputWrapper>

      {/* Area Select */}
      <InputWrapper
        label=""
        labelFor="shippingAddress.0.area"
        error={errors?.shippingAddress?.[0]?.area?.message}
      >
        <div className="flex items-center gap-2 mb-1">
          <label className="text-sm font-medium">Area</label>
          <FaStarOfLife className="h-2 w-2 text-muted-foreground text-red-500" />
        </div>
        <SearchableSelect
          label="Area"
          labelFor="area"
          value={watch("shippingAddress.0.areaId")?.toString() || ""}
          onValueChange={(value: string) => {
            const area = areaList.find(a => a.area_id.toString() === value);
            if (area) {
              handleAreaChange(area.area_id, area.area_name);
            }
          }}
          options={areaList.map(area => ({
            id: area.area_id,
            name: area.area_name
          }))}
          error={errors?.shippingAddress?.[0]?.area?.message}
          labelKey="name"
          valueKey="id"
          disabled={!selectedZoneId}
        />
      </InputWrapper>

      {/* Email Input */}
      <InputWrapper
        label="Email"
        labelFor="shippingAddress.0.email"
        error={errors?.shippingAddress?.[0]?.email?.message}
      >
        <Input
          placeholder="Email"
          value={watch("shippingAddress.0.email") || ""}
          onChange={(e) => setValue("shippingAddress.0.email", e.target.value)}
          errorMessage={errors?.shippingAddress?.[0]?.email?.message}
        />
      </InputWrapper>

      {/* Address Input */}
      <InputWrapper
        label=""
        labelFor="shippingAddress.0.address"
        error={errors?.shippingAddress?.[0]?.address?.message}
      >
        <div className="flex items-center gap-2 mb-1">
          <label className="text-sm font-medium">Address</label>
          <FaStarOfLife className="h-2 w-2 text-muted-foreground text-red-500" />
        </div>
        <Input
          placeholder="Address (minimum 10 characters)"
          value={watch("shippingAddress.0.address") || ""}
          onChange={(e) =>
            setValue("shippingAddress.0.address", e.target.value)
          }
          errorMessage={errors?.shippingAddress?.[0]?.address?.message}
        />
      </InputWrapper>
    </>
  );
};

export default CreateOrderAddress;