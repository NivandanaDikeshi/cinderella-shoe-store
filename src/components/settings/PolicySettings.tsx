interface Props {
  settings: any;
  setSettings: any;
}

export default function PolicySettings({
  settings,
  setSettings,
}: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">
        Policy Pages
      </h2>

      <textarea
        rows={5}
        placeholder="Privacy Policy"
        value={
          settings.privacyPolicy || ""
        }
        onChange={(e) =>
          setSettings({
            ...settings,
            privacyPolicy:
              e.target.value,
          })
        }
        className="w-full border p-3 rounded mb-4"
      />

      <textarea
        rows={5}
        placeholder="Shipping Policy"
        value={
          settings.shippingPolicy || ""
        }
        onChange={(e) =>
          setSettings({
            ...settings,
            shippingPolicy:
              e.target.value,
          })
        }
        className="w-full border p-3 rounded"
      />
    </div>
  );
}