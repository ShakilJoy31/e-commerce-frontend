import ButtonLoader from "@/components/loader/ButtonLoader";
import {
  useGetPathaoAreasQuery,
  useGetPathaoCitiesQuery,
  useGetPathaoZonesQuery,
  useUpdateShippingInfoMutation,
} from "@/components/store/api/shippingAddressApi";
import { Button } from "@/components/ui/button";
import SearchableSelect from "@/pages/dashboard/products/SearchableSelect";
import { requiredStar } from "@/utils/helper/requiredStar";
import { FormControl, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

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

const EditShippingAddress = ({ actionItem, setIsEditModalOpen }: any) => {
  const { data: pathaoCities } = useGetPathaoCitiesQuery(undefined);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
  const { data: zones } = useGetPathaoZonesQuery(selectedCityId!, {
    skip: !selectedCityId,
  });
  const { data: areas } = useGetPathaoAreasQuery(selectedZoneId!, {
    skip: !selectedZoneId,
  });

  const cities: City[] = pathaoCities?.data?.data?.data || [];
  const zoneList: Zone[] = zones?.data?.data?.data || [];
  const areaList: Area[] = areas?.data?.data?.data || [];
  const [updateAddress, { isLoading: updateLoading }] =
    useUpdateShippingInfoMutation();

  const {
    register,
    formState: { errors },
    setValue,
    watch,
    reset,
    trigger,
  } = useForm({
    defaultValues: {
      cityId: actionItem?.cityId || null,
      city: actionItem?.city || "",
      zoneId: actionItem?.zoneId || null,
      zone: actionItem?.zone || "",
      areaId: actionItem?.areaId || null,
      area: actionItem?.area || "",
      address: actionItem?.address || "",
      isPrimary: actionItem?.isPrimary || false,
    },
  });

  const [addressError, setAddressError] = useState<string | null>(null);

 
  useEffect(() => {
    if (actionItem) {
      setSelectedCityId(actionItem.cityId);
      setSelectedZoneId(actionItem.zoneId);
      reset({
        cityId: actionItem.cityId,
        city: actionItem.city,
        zoneId: actionItem.zoneId,
        zone: actionItem.zone,
        areaId: actionItem.areaId,
        area: actionItem.area,
        address: actionItem.address,
        isPrimary: actionItem.isPrimary,
      });
    }
  }, [actionItem, reset]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (name === "address") {
      if (value.length < 10 && value.length > 0) {
        setAddressError("Address must be at least 10 characters");
      } else {
        setAddressError(null);
      }
    }

    setValue(name as any, type === "checkbox" ? checked : value);
    trigger(name as any);
  };

  const handleCityChange = (cityId: number, cityName: string) => {
    setSelectedCityId(cityId);
    setSelectedZoneId(null);
    setValue("cityId", cityId);
    setValue("city", cityName);
    setValue("zoneId", null);
    setValue("zone", "");
    setValue("areaId", null);
    setValue("area", "");
  };

  const handleZoneChange = (zoneId: number, zoneName: string) => {
    setSelectedZoneId(zoneId);
    setValue("zoneId", zoneId);
    setValue("zone", zoneName);
    setValue("areaId", null);
    setValue("area", "");
  };

  const handleAreaChange = (areaId: number, areaName: string) => {
    setValue("areaId", areaId);
    setValue("area", areaName);
  };

  const onSubmit = async () => {
    const data=watch()
    
    if (!data?.cityId || !data?.zoneId || !data?.areaId) {
      toast.error("Please select city, zone, and area");
      return;
    }

    if (!data?.address || data?.address.length < 10) {
      setAddressError("Address must be at least 10 characters");
      return;
    }

    try {
      const result = await updateAddress({
        id: actionItem?.id,
        data: {
          cityId: data?.cityId,
          zoneId: data?.zoneId,
          areaId: data?.areaId,
          address: data?.address,
          isPrimary: data?.isPrimary,
          city:data?.city,
          zone:data?.zone,
          area:data?.area
        },
      }).unwrap();

      if (result?.success) {
        toast.success(result.message);
        setIsEditModalOpen(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update address");
    }
  };

  return (
    <div>
      <div className="overflow-hidden p-2">
        <div>
          <p>City {requiredStar}</p>
          <SearchableSelect
            label="City"
            options={cities.map((city) => ({
              id: city.city_id,
              name: city.city_name,
            }))}
            value={watch("cityId")?.toString() || ""}
            onValueChange={(value) => {
              const city = cities.find((c) => c.city_id.toString() === value);
              if (city) {
                handleCityChange(city.city_id, city.city_name);
              }
            }}
            placeholder="Select City"
            labelKey="name"
            valueKey="id"
          />
          {errors.cityId && (
            <p className="text-red-500 text-sm mt-1">City is required</p>
          )}
        </div>

        <FormControl fullWidth margin="normal">
          <p>Zone {requiredStar}</p>
          <SearchableSelect
            label="Zone"
            options={zoneList.map((zone) => ({
              id: zone.zone_id,
              name: zone.zone_name,
            }))}
            value={watch("zoneId")?.toString() || ""}
            onValueChange={(value) => {
              const zone = zoneList.find((z) => z.zone_id.toString() === value);
              if (zone) {
                handleZoneChange(zone.zone_id, zone.zone_name);
              }
            }}
            placeholder="Select Zone"
            disabled={!selectedCityId}
            labelKey="name"
            valueKey="id"
          />
          {errors.zoneId && (
            <p className="text-red-500 text-sm mt-1">Zone is required</p>
          )}
        </FormControl>

        <FormControl fullWidth margin="normal">
          <p>Area {requiredStar}</p>
          <SearchableSelect
            label="Area"
            options={areaList.map((area) => ({
              id: area.area_id,
              name: area.area_name,
            }))}
            value={watch("areaId")?.toString() || ""}
            onValueChange={(value) => {
              const area = areaList.find((a) => a.area_id.toString() === value);
              if (area) {
                handleAreaChange(area.area_id, area.area_name);
              }
            }}
            placeholder="Select Area"
            disabled={!selectedZoneId}
            labelKey="name"
            valueKey="id"
          />
          {errors.areaId && (
            <p className="text-red-500 text-sm mt-1">Area is required</p>
          )}
        </FormControl>

        <p className="mb-[-10px] mt-3">Address {requiredStar}</p>
        <TextField
          margin="normal"
          required
          fullWidth
          {...register("address", { required: true, minLength: 10 })}
          value={watch("address")}
          onChange={handleInputChange}
          multiline
          rows={3}
          variant="outlined"
          error={!!errors.address || !!addressError}
          helperText={errors.address ? "Address is required" : addressError}
        />

        <div className="flex items-center gap-1 mt-3">
          <input
            type="checkbox"
            {...register("isPrimary")}
            checked={watch("isPrimary") || false}
            onChange={(e) => setValue("isPrimary", e.target.checked)}
            className="w-5 h-5"
          />
          <label className="text-sm">Set as primary address</label>
        </div>

        <div className="flex justify-end mt-4 gap-3">
          <Button type="button" onClick={onSubmit} disabled={updateLoading}>
            {updateLoading ? <ButtonLoader /> : "Update Address"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditShippingAddress;
