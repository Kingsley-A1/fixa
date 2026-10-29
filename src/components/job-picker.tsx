"use client";
import { useState } from "react";
type Customer = { id: string; name: string; phone: string };
type Device = {
  id: string;
  customerId: string;
  brand: string;
  model: string;
  code: string;
};
export function CustomerDevicePicker({
  customers,
  devices,
}: {
  customers: Customer[];
  devices: Device[];
}) {
  const [id, setId] = useState("");
  const related = devices.filter((d) => d.customerId === id);
  return (
    <>
      <label className="field">
        <span>Customer *</span>
        <select
          name="customerId"
          required
          value={id}
          onChange={(e) => setId(e.target.value)}
        >
          <option value="" disabled>
            Select a customer
          </option>
          {customers.map((c) => (
            <option value={c.id} key={c.id}>
              {c.name} · {c.phone}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Device *</span>
        <select name="deviceId" key={id} required defaultValue="">
          <option value="" disabled>
            {id ? "Choose registered device" : "Select a customer first"}
          </option>
          {related.map((d) => (
            <option key={d.id} value={d.id}>
              {d.brand} {d.model} · {d.code}
            </option>
          ))}
        </select>
      </label>
      {id && related.length === 0 && (
        <p className="form-hint">
          No device is registered for this customer yet. Register a device
          first.
        </p>
      )}
    </>
  );
}
