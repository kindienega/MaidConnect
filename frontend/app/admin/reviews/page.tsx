"use client";

import { useAdminApi } from "@/hooks/useAdminApi";
import { Table } from "@/components/admin";
import { useEffect } from "react";

export default function ReviewsPage() {
  const { reviews, fetchReviews, approveReview, flagReview, loading } =
    useAdminApi();

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Broker Reviews</h1>
      <Table
        columns={[
          { label: "Broker", key: "broker" },
          { label: "Reviewer", key: "reviewer" },
          { label: "Rating", key: "rating" },
          { label: "Comment", key: "comment" },
          { label: "Status", key: "status" },
          { label: "Actions", key: "actions" },
        ]}
        data={reviews}
        loading={loading}
        renderActions={(review) => (
          <div className="flex gap-2">
            <button
              onClick={() => approveReview(review._id)}
              className="btn btn-xs btn-success"
            >
              Approve
            </button>
            <button
              onClick={() => flagReview(review._id)}
              className="btn btn-xs btn-error"
            >
              Flag
            </button>
          </div>
        )}
      />
    </div>
  );
}
