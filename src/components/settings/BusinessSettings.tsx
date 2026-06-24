interface Props {
  settings: any;
  setSettings: any;
}

export default function BusinessSettings({
  settings,
  setSettings,
}: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">
        Business Settings
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        <input
          type="text"
          placeholder="Business Name"
          value={
            settings.businessName || ""
          }
          onChange={(e) =>
            setSettings({
              ...settings,
              businessName:
                e.target.value,
            })
          }
          className="border p-3 rounded"
        />

        <input
          type="text"
          placeholder="Phone"
          value={settings.phone || ""}
          onChange={(e) =>
            setSettings({
              ...settings,
              phone: e.target.value,
            })
          }
          className="border p-3 rounded"
        />

        <input
          type="email"
          placeholder="Email"
          value={settings.email || ""}
          onChange={(e) =>
            setSettings({
              ...settings,
              email: e.target.value,
            })
          }
          className="border p-3 rounded"
        />

        <input
          type="text"
          placeholder="Address"
          value={
            settings.address || ""
          }
          onChange={(e) =>
            setSettings({
              ...settings,
              address:
                e.target.value,
            })
          }
          className="border p-3 rounded"
        />

      </div>
    </div>
  );
}