import "../consumer-app.css";
import { ConsumerAppShell } from "@/components/consumer-app-shell";

export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  return <ConsumerAppShell>{children}</ConsumerAppShell>;
}
