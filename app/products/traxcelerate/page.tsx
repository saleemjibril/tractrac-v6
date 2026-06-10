import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "TRAxCelerate",
  description:
    "Building the human infrastructure for Nigeria's mechanisation revolution.",
};

export default function TraxcelerateProductRedirect() {
  redirect("/traxcelerate-product-page");
}
