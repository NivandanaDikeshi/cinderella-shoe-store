"use client";

import { useEffect, useState } from "react";

import customerService from "@/services/customerService";

import CustomerTable from "@/components/customers/CustomerTable";

export default function CustomersPage() {
  const [customers, setCustomers] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers =
    async () => {
      try {
        const data =
          await customerService.getCustomers();

        setCustomers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <div>
        Loading Customers...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Customers
      </h1>

      <CustomerTable
        customers={customers}
      />
    </div>
  );
}