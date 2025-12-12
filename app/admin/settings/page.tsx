"use client";

import { useEffect, useState } from "react";

import { Check, Save } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

interface Settings {
  storeName: string;
  storeEmail: string;
  currency: string;
  freeShippingThreshold: number;
  standardShippingCost: number;
  expressShippingCost: number;
}

const defaultSettings: Settings = {
  storeName: "SEESAW",
  storeEmail: "",
  currency: "KRW",
  freeShippingThreshold: 200000,
  standardShippingCost: 3000,
  expressShippingCost: 6000,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const supabase = createClient();

  useEffect(() => {
    const loadSettings = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }

      const savedSettings = localStorage.getItem("admin_settings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    };

    loadSettings();
  }, [supabase.auth]);

  const handleSave = async () => {
    setIsSaving(true);

    localStorage.setItem("admin_settings", JSON.stringify(settings));

    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChange = (field: keyof Settings, value: string | number) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-light">Settings</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage store settings</p>
      </div>

      <section className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Account</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-1">Admin Email</label>
            <p className="text-sm">{userEmail}</p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Store</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Store Name</label>
            <input
              type="text"
              value={settings.storeName}
              onChange={(e) => handleChange("storeName", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Email</label>
            <input
              type="email"
              value={settings.storeEmail}
              onChange={(e) => handleChange("storeEmail", e.target.value)}
              placeholder="contact@store.com"
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => handleChange("currency", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
            >
              <option value="KRW">KRW (₩)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Shipping</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Free Shipping Threshold (₩)</label>
            <input
              type="number"
              value={settings.freeShippingThreshold}
              onChange={(e) => handleChange("freeShippingThreshold", Number(e.target.value))}
              min="0"
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Orders above this amount get free shipping
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Standard Shipping (₩)</label>
              <input
                type="number"
                value={settings.standardShippingCost}
                onChange={(e) => handleChange("standardShippingCost", Number(e.target.value))}
                min="0"
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Express Shipping (₩)</label>
              <input
                type="number"
                value={settings.expressShippingCost}
                onChange={(e) => handleChange("expressShippingCost", Number(e.target.value))}
                min="0"
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Admin Access</h2>
        <p className="text-sm text-neutral-500 mb-4">
          Admin emails are configured in the code. To add or remove admins, edit the{" "}
          <code className="px-1 py-0.5 bg-neutral-100 rounded text-xs">app/admin/layout.tsx</code>{" "}
          file.
        </p>
        <div className="bg-neutral-50 rounded-lg p-4">
          <p className="text-xs font-mono text-neutral-600">
            const ADMIN_EMAILS = [&quot;admin@seesaw.com&quot;, &quot;your-email@example.com&quot;];
          </p>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 text-white text-sm rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Settings"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
