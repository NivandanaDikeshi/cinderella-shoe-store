"use client";

import { useState } from "react";

interface Props {
  onSave: (data: any) => Promise<void>;
}

export default function BannerForm({
  onSave,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      title: "",
      subtitle: "",
      imageUrl: "",
      buttonText: "",
      buttonLink: "",
      active: true,
      displayOrder: 1,
    });

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await onSave(form);

      setForm({
        title: "",
        subtitle: "",
        imageUrl: "",
        buttonText: "",
        buttonLink: "",
        active: true,
        displayOrder: 1,
      });

      alert(
        "Banner created successfully"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to create banner"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow mb-6"
    >
      <h2 className="text-xl font-bold mb-4">
        Create Banner
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        <input
          type="text"
          placeholder="Banner Title"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
          className="border p-3 rounded"
          required
        />

        <input
          type="text"
          placeholder="Subtitle"
          value={form.subtitle}
          onChange={(e) =>
            setForm({
              ...form,
              subtitle:
                e.target.value,
            })
          }
          className="border p-3 rounded"
        />

        <input
          type="text"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) =>
            setForm({
              ...form,
              imageUrl:
                e.target.value,
            })
          }
          className="border p-3 rounded"
          required
        />

        <input
          type="text"
          placeholder="Button Text"
          value={form.buttonText}
          onChange={(e) =>
            setForm({
              ...form,
              buttonText:
                e.target.value,
            })
          }
          className="border p-3 rounded"
        />

        <input
          type="text"
          placeholder="Button Link"
          value={form.buttonLink}
          onChange={(e) =>
            setForm({
              ...form,
              buttonLink:
                e.target.value,
            })
          }
          className="border p-3 rounded"
        />

        <input
          type="number"
          placeholder="Display Order"
          value={
            form.displayOrder
          }
          onChange={(e) =>
            setForm({
              ...form,
              displayOrder:
                Number(
                  e.target.value
                ),
            })
          }
          className="border p-3 rounded"
        />

      </div>

      <div className="mt-4">
        <label className="flex gap-2">
          <input
            type="checkbox"
            checked={form.active}
            onChange={() =>
              setForm({
                ...form,
                active:
                  !form.active,
              })
            }
          />

          Active Banner
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-pink-600 text-white px-6 py-3 rounded mt-4"
      >
        {loading
          ? "Saving..."
          : "Save Banner"}
      </button>
    </form>
  );
}