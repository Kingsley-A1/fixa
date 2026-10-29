import type { Metadata } from "next";
import { DemoWorkspace } from "@/components/demo-workspace";
export const metadata: Metadata = {
  title: "Interactive workspace demo",
  robots: { index: false, follow: false },
};
export default function DemoPage() {
  return <DemoWorkspace />;
}
