"use client";
import React, { useCallback, useEffect } from "react";
import { Message } from "@/models/User";
import { useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

function page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };
  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast("error", {
        description:
          axiosError.response?.data.message ||
          "failed to fetch message settings.",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get/messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast("Refershed messages", {
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast("error", {
          description:
            axiosError.response?.data.message ||
            "failed to fetch message settings.",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );
  useEffect(() => {
    if (!session || !session.user)  return
    fetchMessages()
    fetchAcceptMessage()
  }, [session, setValue, fetchMessages, fetchAcceptMessage]);
  const handleSwitchChange = async()=>{
    try {
      await axios.post<ApiResponse>("/api/accept-messages",{
        acceptMessages:!acceptMessages
      })
    } catch (error) {
      
    }
  }
  return <div></div>;
}

export default page;
