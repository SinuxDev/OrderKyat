import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ExtractedData } from "@/types/invoice";
import AddressCombobox from "@/components/molecules/AddressCombox";

interface CustomerDetailsSectionProps {
  formData: ExtractedData;
  updateField: (field: keyof ExtractedData, value: string) => void;
  handlePhoneChange: (value: string) => void;
}

export default function CustomerDetailsSection({
  formData,
  updateField,
  handlePhoneChange,
}: CustomerDetailsSectionProps) {
  const handleAddressChange = (value: string) => {
    updateField("address", value);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center gap-2 text-slate-700 mb-4">
        <span className="text-2xl">🎫</span>
        <h3 className="text-lg font-semibold">Customer Details</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customer-name" className="text-sm font-medium">
            Customer Name
          </Label>
          <Input
            id="customer-name"
            value={formData.customerName}
            onChange={(e) => updateField("customerName", e.target.value)}
            placeholder="Enter customer name"
            className="bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-blue-500/20 h-11 lg:h-12 text-sm lg:text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="+95 9 XXX XXX XXX"
            className="bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-blue-500/20 h-11 lg:h-12 text-sm lg:text-base"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Address / City</Label>
        <AddressCombobox
          value={formData.address}
          onChange={handleAddressChange}
        />
        <p className="text-xs text-slate-500">
          💡 Select from popular cities or type your own
        </p>
      </div>
    </div>
  );
}
