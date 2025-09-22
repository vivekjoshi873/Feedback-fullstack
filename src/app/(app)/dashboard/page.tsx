"use client"
import React from 'react'
import { Message } from '@/models/User'
import { useState } from 'react'
import { toast } from "sonner";

function page() {
  const [messages,setMessages] = useState<Message[]>([])
  const [isLoading,setIsLoading] = useState(false)
  const [isSwitchLoading,setIsSwitchLoading] = useState(false)
  const handleDeleteMessage =(messageId:string)=>{
    setMessages(messages.filter((message)=>message._id!==messageId))
  }
  return (
    <div>

      
    </div>
  )
}

export default page
