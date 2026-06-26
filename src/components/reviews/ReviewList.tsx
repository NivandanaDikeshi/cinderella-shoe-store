"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, User, Trash2, Pencil } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import {
  deleteReview,
  updateReview,
} from "@/services/reviewService";

export default function ReviewList({ reviews, reloadReviews }: any) {
  const { user } = useAuthStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);

  const startEdit = (r: any) => {
    setEditingId(r.id);
    setEditComment(r.comment);
    setEditRating(r.rating);
  };

  const saveEdit = async (id: string) => {
    await updateReview(id, {
      comment: editComment,
      rating: Number(editRating),
    });

    setEditingId(null);
    reloadReviews();
  };

  const remove = async (id: string) => {
    await deleteReview(id);
    reloadReviews();
  };

  return (
    <div className="space-y-4">
      {reviews.map((r: any) => (
        <div key={r.id} className="rounded-xl border bg-white p-4">

          <div className="flex gap-3">

            {r.userPhoto ? (
              <Image
                src={r.userPhoto}
                alt="user"
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <User />
            )}

            <div className="w-full">

              <p className="font-semibold">{r.userName}</p>

              {/* stars */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    className={
                      s <= r.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>

              {/* EDIT MODE */}
              {editingId === r.id ? (
                <>
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="mt-2 w-full rounded border p-2"
                  />

                  <button
                    onClick={() => saveEdit(r.id)}
                    className="mt-2 rounded bg-green-600 px-3 py-1 text-white"
                  >
                    Save
                  </button>
                </>
              ) : (
                <p className="mt-2 text-gray-600">{r.comment}</p>
              )}

              {/* ACTIONS */}
              {user?.uid === r.userId && (
                <div className="mt-2 flex gap-3 text-sm">
                  <button
                    onClick={() => startEdit(r)}
                    className="flex items-center gap-1 text-blue-600"
                  >
                    <Pencil size={14} /> Edit
                  </button>

                  <button
                    onClick={() => remove(r.id)}
                    className="flex items-center gap-1 text-red-600"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      ))}
    </div>
  );
}