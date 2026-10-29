export const statuses = [
  "Received",
  "Diagnosing",
  "Awaiting approval",
  "In progress",
  "Ready to collect",
  "Collected",
  "Cancelled",
] as const;
export type DemoStatus = (typeof statuses)[number];
export type DemoJob = {
  id: string;
  customer: string;
  device: string;
  issue: string;
  status: DemoStatus;
  estimate: number;
  date: string;
};
export const sampleJobs: DemoJob[] = [
  {
    id: "FX-1028",
    customer: "Amaka Okafor",
    device: "iPhone 13 Pro",
    issue: "Screen replacement",
    status: "In progress",
    estimate: 85000,
    date: "2026-10-29",
  },
  {
    id: "FX-1027",
    customer: "David Adeyemi",
    device: "MacBook Air M2",
    issue: "Battery replacement",
    status: "Ready to collect",
    estimate: 120000,
    date: "2026-10-29",
  },
  {
    id: "FX-1026",
    customer: "Tolu Bakare",
    device: "Samsung Galaxy S23",
    issue: "Charging port repair",
    status: "Diagnosing",
    estimate: 25000,
    date: "2026-10-28",
  },
  {
    id: "FX-1025",
    customer: "Chidinma Eze",
    device: "HP EliteBook 840",
    issue: "Keyboard not responding",
    status: "Awaiting approval",
    estimate: 45000,
    date: "2026-10-28",
  },
  {
    id: "FX-1024",
    customer: "Ibrahim Musa",
    device: "iPhone 12",
    issue: "Battery draining quickly",
    status: "Received",
    estimate: 40000,
    date: "2026-10-28",
  },
  {
    id: "FX-1023",
    customer: "Funke Bello",
    device: "Dell XPS 13",
    issue: "Operating system recovery",
    status: "Collected",
    estimate: 15000,
    date: "2026-10-27",
  },
];
export function jobMatches(job: DemoJob, query: string, status: string) {
  return (
    (status === "All statuses" || job.status === status) &&
    [job.id, job.customer, job.device, job.issue].some((v) =>
      v.toLowerCase().includes(query.toLowerCase().trim()),
    )
  );
}
export function jobSummary(jobs: DemoJob[]) {
  return {
    total: jobs.length,
    active: jobs.filter(
      (j) => !["Collected", "Cancelled", "Ready to collect"].includes(j.status),
    ).length,
    ready: jobs.filter((j) => j.status === "Ready to collect").length,
    customers: new Set(jobs.map((j) => j.customer.toLowerCase())).size,
  };
}
