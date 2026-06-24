"use client";

import { Star, User } from "lucide-react";

export default function ReviewList({ reviews }: any) {
  return (
    <div className="mt-10 space-y-4">

      <h3 className="text-xl font-bold">
        Customer Reviews
      </h3>

      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet</p>
      ) : (
        reviews.map((r: any) => (
          <div
            key={r.id}
            className="bg-white border rounded-2xl p-4 shadow-sm"
          >

            {/* USER */}
            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                {r.userPhoto ? (
                  <img
                    src={r.userPhoto}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <User size={18} />
                )}
              </div>

              <div>
                <p className="font-semibold">
                  {r.userName}
                </p>

                {/* STARS */}
                <div className="flex">
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
              </div>
            </div>

            {/* COMMENT */}
            <p className="mt-3 text-gray-600">
              {r.comment}
            </p>

          </div>
        ))
      )}
    </div>
  );
}