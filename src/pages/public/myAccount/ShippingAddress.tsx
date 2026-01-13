// components/account/ShippingAddress.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  FormControl,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import {
  useCreateShippingInfoMutation,
  useDeleteShippingInfoMutation,
  useGetPathaoCitiesQuery,
  useGetPathaoZonesQuery,
  useGetPathaoAreasQuery,
  useGetShippingInfoQuery,
} from "@/components/store/api/shippingAddressApi";
import Cookies from "js-cookie";
import { toast } from "@/components/ui/use-toast";
import SearchableSelect from "@/pages/dashboard/products/SearchableSelect";
import { requiredStar } from "@/utils/helper/requiredStar";
import { LocateIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Paragraph from "@/components/typography/Paragraph";

interface ShippingAddress {
  id: number;
  cityId: number;
  city: string;
  zoneId: number;
  zone: string;
  areaId: number;
  area: string;
  address: string;
  isPrimary: boolean;
}

interface FormData {
  cityId: number | null;
  city: string;
  zoneId: number | null;
  zone: string;
  areaId: number | null;
  area: string;
  address: string;
  isPrimary: boolean;
}

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

const ShippingAddress = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);

  // API hooks
  const { data: shippingInfo, refetch } = useGetShippingInfoQuery(undefined);
  const [createShippingInfo] = useCreateShippingInfoMutation();
  const [deleteShippingInfo] = useDeleteShippingInfoMutation();

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

  const [formData, setFormData] = useState<FormData>({
    cityId: null,
    city: "",
    zoneId: null,
    zone: "",
    areaId: null,
    area: "",
    address: "",
    isPrimary: false,
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    refetch();
    if (pathaoCities) {
      setLoading(false);
    }
  }, [shippingInfo, refetch, pathaoCities]);

  const handleCreate = () => {
    setFormData({
      cityId: null,
      city: "",
      zoneId: null,
      zone: "",
      areaId: null,
      area: "",
      address: "",
      isPrimary: false,
    });
    setSelectedCityId(null);
    setSelectedZoneId(null);
    setEditingId(null);
    setAddressError(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (record: ShippingAddress) => {
    setFormData({
      cityId: record.cityId,
      city: record.city,
      zoneId: record.zoneId,
      zone: record.zone,
      areaId: record.areaId,
      area: record.area,
      address: record.address,
      isPrimary: record.isPrimary,
    });
    setSelectedCityId(record.cityId);
    setSelectedZoneId(record.zoneId);
    setEditingId(record.id);
    setAddressError(null);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setAddressToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (addressToDelete) {
      try {
        await deleteShippingInfo(addressToDelete).unwrap();
        refetch();
        setIsDeleteDialogOpen(false);
        setAddressToDelete(null);
        toast({
          variant: "default",
          title: "Success!",
          description: "Shipping address deleted successfully",
        });
      } catch (error) {
        console.error("Failed to delete shipping address", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete shipping address",
        });
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setAddressToDelete(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (name === "address") {
      if (value.length < 10 && value.length > 0) {
        setAddressError("Address must be at least 10 characters");
      } else {
        setAddressError(null);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCityChange = (cityId: number, cityName: string) => {
    setSelectedCityId(cityId);
    setSelectedZoneId(null);
    setFormData((prev) => ({
      ...prev,
      cityId,
      city: cityName,
      zoneId: null,
      zone: "",
      areaId: null,
      area: "",
    }));
  };

  const handleZoneChange = (zoneId: number, zoneName: string) => {
    setSelectedZoneId(zoneId);
    setFormData((prev) => ({
      ...prev,
      zoneId,
      zone: zoneName,
      areaId: null,
      area: "",
    }));
  };

  const handleAreaChange = (areaId: number, areaName: string) => {
    setFormData((prev) => ({
      ...prev,
      areaId,
      area: areaName,
    }));
  };

  const handleSubmit = async () => {
    if (formData.address.length < 10) {
      setAddressError("Address must be at least 10 characters");
      return;
    }

    const authToken = Cookies.get("__t_beta__token");
    try {
      if (editingId) {
        // Update operation with fetch
        const response = await fetch(
          `https://api.ecommerce.techelementbd.com/api/v1/user/update-shipping-info/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(formData),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Failed to update shipping info");
        }

        toast({
          variant: "default",
          title: "Success!",
          description: data?.message || "Shipping address updated successfully",
        });
      } else {
        await createShippingInfo(formData).unwrap();
        toast({
          variant: "default",
          title: "Success!",
          description: "Shipping address created successfully",
        });
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Failed to save shipping address", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.data?.message || "Failed to save shipping address",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card sx={{ minWidth: 275, margin: 2 }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Paragraph className="text-lg font-semibold">
            Shipping Address
          </Paragraph>
          {shippingInfo?.data?.length < 3 && (
            <Button className="h-7 lg:h-9 px-2 lg:px-4" onClick={handleCreate}>
              Add New Address
            </Button>
          )}
        </Box>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shippingInfo?.data?.map((address, index) => (
            <div
              key={address.id}
              className={`relative h-full flex flex-col rounded-lg shadow-md overflow-hidden 
            transition-all duration-200 hover:shadow-lg hover:-translate-y-1
            border-l-4 ${
              address.isPrimary ? "border-blue-500" : "border-gray-200"
            }`}
            >
              <div className="flex-1 p-4">
                <div className="flex items-center mb-2">
                  <LocateIcon className="text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold">Address {index + 1}</h3>
                  {address.isPrimary && (
                    <span className="ml-2 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                      Primary
                    </span>
                  )}
                </div>

                <div className="space-y-1 mb-3 text-gray-900">
                  <p className="text-base">
                    <span className="font-semibold">City:</span> {address.city}
                  </p>
                  <p className="text-base">
                    <span className="font-semibold">Zone:</span> {address.zone}
                  </p>
                  <p className="text-base">
                    <span className="font-semibold">Area:</span> {address.area}
                  </p>
                </div>

                <div className="py-1 bg-gray-50 rounded-md mb-3">
                  <p className="text-base text-gray-800">
                    <span className="font-semibold">Address: </span>
                    {address.address}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 justify-end p-2">
                <Button
                  onClick={() => handleEdit(address)}
                  className="h-7 lg:h-9"
                >
                  <span className="text-base">Edit</span>
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteClick(address.id)}
                  className=" bg-red-600 h-7 lg:h-9"
                >
                  <span className="text-base">Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Address Dialog */}
        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {editingId ? "Edit Shipping Address" : "Add Shipping Address"}
            <IconButton
              aria-label="close"
              onClick={() => setIsDialogOpen(false)}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box component="form" sx={{ mt: 1 }}>
              {/* City Dropdown */}
              <FormControl fullWidth margin="normal">
                <p>City {requiredStar}</p>
                <SearchableSelect
                  label="City"
                  options={cities.map((city) => ({
                    id: city.city_id,
                    name: city.city_name,
                  }))}
                  value={formData.cityId?.toString() || ""}
                  onValueChange={(value) => {
                    const city = cities.find(
                      (c) => c.city_id.toString() === value
                    );
                    if (city) {
                      handleCityChange(city.city_id, city.city_name);
                    }
                  }}
                  placeholder="Select City"
                  labelKey="name"
                  valueKey="id"
                />
              </FormControl>

              {/* Zone Dropdown */}
              <FormControl fullWidth margin="normal">
                <p>Zone {requiredStar}</p>
                <SearchableSelect
                  label="Zone"
                  options={zoneList.map((zone) => ({
                    id: zone.zone_id,
                    name: zone.zone_name,
                  }))}
                  value={formData.zoneId?.toString() || ""}
                  onValueChange={(value) => {
                    const zone = zoneList.find(
                      (z) => z.zone_id.toString() === value
                    );
                    if (zone) {
                      handleZoneChange(zone.zone_id, zone.zone_name);
                    }
                  }}
                  placeholder="Select Zone"
                  disabled={!selectedCityId}
                  labelKey="name"
                  valueKey="id"
                />
              </FormControl>

              {/* Area Dropdown */}
              <FormControl fullWidth margin="normal">
                <p>Area {requiredStar}</p>
                <SearchableSelect
                  label="Area"
                  options={areaList.map((area) => ({
                    id: area.area_id,
                    name: area.area_name,
                  }))}
                  value={formData.areaId?.toString() || ""}
                  onValueChange={(value) => {
                    const area = areaList.find(
                      (a) => a.area_id.toString() === value
                    );
                    if (area) {
                      handleAreaChange(area.area_id, area.area_name);
                    }
                  }}
                  placeholder="Select Area"
                  disabled={!selectedZoneId}
                  labelKey="name"
                  valueKey="id"
                />
              </FormControl>

              <p className="mb-[-10px] mt-3">Address {requiredStar}</p>
              <TextField
                margin="normal"
                required
                fullWidth
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                multiline
                rows={3}
                variant="outlined"
                error={!!addressError}
                helperText={addressError}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isPrimary}
                    onChange={handleInputChange}
                    name="isPrimary"
                    color="primary"
                  />
                }
                label="Set as primary address"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              className="h-7 lg:h-9"
              variant={"destructive"}
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="h-7 lg:h-9"
              onClick={handleSubmit}
              variant="default"
              disabled={
                !formData.cityId ||
                !formData.zoneId ||
                !formData.areaId ||
                !formData.address ||
                !!addressError
              }
            >
              {editingId ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={isDeleteDialogOpen}
          onClose={handleCancelDelete}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Are you sure you want to delete this shipping address?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete}>Cancel</Button>
            <Button
              variant={"destructive"}
              onClick={handleConfirmDelete}
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ShippingAddress;
