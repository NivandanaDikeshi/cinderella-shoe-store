interface Props {
  settings: any;
  setSettings: any;
}

export default function ShippingSettings({
  settings,
  setSettings,
}: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">
        Shipping Settings
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        <input
          type="number"
          placeholder="Delivery Fee"
          value={
            settings.deliveryFee || 0
          }
          onChange={(e) =>
            setSettings({
              ...settings,
              deliveryFee:
                Number(
                  e.target.value
                ),
            })
          }
          className="border p-3 rounded"
        />

        <input
          type="number"
          placeholder="Free Shipping Amount"
          value={
            settings.freeShippingAmount || 0
          }
          onChange={(e) =>
            setSettings({
              ...settings,
              freeShippingAmount:
                Number(
                  e.target.value
                ),
            })
          }
          className="border p-3 rounded"
        />

      </div>
    </div>
  );
}