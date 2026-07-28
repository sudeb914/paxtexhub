import type { Metadata } from "next";
import { MessagingPage } from "@/components/messages/MessagingPage";
export const metadata: Metadata = { title: "Messages" };
export default function MessagesPage() { return <MessagingPage/>; }
