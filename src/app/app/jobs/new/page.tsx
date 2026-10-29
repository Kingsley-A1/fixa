import { requireWorkspace } from "@/lib/auth";
import { db } from "@/lib/db";
import { createJob } from "@/app/actions";
import { Field, FormShell, Area } from "@/components/forms";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CustomerDevicePicker } from "@/components/job-picker";
export default async function NewJob() {
  const { business } = await requireWorkspace();
  const customers = await db.customer.findMany({
    where: { businessId: business.id },
    orderBy: { name: "asc" },
    select: { id: true, name: true, phone: true },
  });
  const devices = await db.device.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      customerId: true,
      brand: true,
      model: true,
      code: true,
    },
  });
  return (
    <main id="main-content" className="workspace fade-in">
      <div className="page-head">
        <div className="intro">
          <Link className="text-link" href="/app/jobs">
            <ChevronLeft size={16} /> Repair jobs
          </Link>
          <h1>New repair job</h1>
          <p>Capture the details that matter. We’ll handle the ticket.</p>
        </div>
      </div>
      <section className="panel form-panel">
        {customers.length && devices.length ? (
          <FormShell action={createJob} button="Create repair ticket">
            <CustomerDevicePicker customers={customers} devices={devices} />
            <Area
              name="issue"
              label="Reported problem"
              placeholder="What is wrong with the device?"
              required
            />
            <div className="form-grid">
              <Field
                name="condition"
                label="Physical condition"
                placeholder="e.g. Minor scratches"
              />
              <Field
                name="accessories"
                label="Items received"
                placeholder="e.g. Charger and pouch"
              />
              <Field
                name="estimatedPrice"
                label="Estimated charge (₦)"
                type="number"
                placeholder="0.00"
              />
              <Field
                name="deposit"
                label="Deposit received (₦)"
                type="number"
                placeholder="0.00"
              />
              <Field name="dueDate" label="Expected completion" type="date" />
            </div>
            <p className="form-hint">
              This is a service acknowledgment, not proof of payment or
              authorization to collect. Confirm extra charges with the customer.
            </p>
          </FormShell>
        ) : (
          <div className="empty">
            <h3>Let’s prepare your first job</h3>
            <p>
              You need at least one customer and one device before creating a
              repair ticket.
            </p>
            <Link
              className="btn primary"
              href={
                customers.length ? "/app/devices/new" : "/app/customers/new"
              }
            >
              {customers.length ? "Register device" : "Add customer"}
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
