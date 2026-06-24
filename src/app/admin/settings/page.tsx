"use client";

import { useEffect, useState } from "react";

import settingsService from "@/services/settingsService";

import BusinessSettings from "@/components/settings/BusinessSettings";
import ShippingSettings from "@/components/settings/ShippingSettings";
import PolicySettings from "@/components/settings/PolicySettings";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);

      const data =
        await settingsService.getSettings();

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error(
        "Load Settings Error:",
        error
      );

      setMessage(
        "Failed to load settings."
      );
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    try {
      setSaving(true);

      await settingsService.saveSettings(
        settings
      );

      setMessage(
        "✅ Settings saved successfully."
      );

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "Save Settings Error:",
        error
      );

      setMessage(
        "❌ Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500 text-lg">
          Loading Settings...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Store Settings
        </h1>

        <button
          onClick={save}
          disabled={saving}
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium transition"
        >
          {saving
            ? "Saving..."
            : "Save Settings"}
        </button>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.includes("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-6">

        <BusinessSettings
          settings={settings}
          setSettings={setSettings}
        />

        <ShippingSettings
          settings={settings}
          setSettings={setSettings}
        />

        <PolicySettings
          settings={settings}
          setSettings={setSettings}
        />

      </div>
    </div>
  );
}