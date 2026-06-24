"use client";

import {
  useParams,
} from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import customerService from "@/services/customerService";

import CustomerDetails from "@/components/customers/CustomerDetails";

export default function CustomerPage() {
  const params =
    useParams();

  const id =
    params.id as string;

  const [customer, setCustomer] =
    useState<any>(null);

  const [notes, setNotes] =
    useState("");

  useEffect(() => {
    loadCustomer();
  }, []);

  const loadCustomer =
    async () => {
      const data =
        await customerService.getCustomerById(
          id
        );

      if (data) {
        setCustomer(data);

        setNotes(
          (data as any).notes || ""
        );
      }
    };

  const saveNotes =
    async () => {
      await customerService.updateCustomerNotes(
        id,
        notes
      );

      alert(
        "Notes saved successfully"
      );
    };

  if (!customer) {
    return (
      <div>
        Loading Customer...
      </div>
    );
  }

  return (
    <CustomerDetails
      customer={customer}
      notes={notes}
      setNotes={setNotes}
      onSave={saveNotes}
    />
  );
}