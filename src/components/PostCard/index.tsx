"use client"

import { PostProvider } from "@/contexts/PostContext"
import { PostProps } from "@/lib/models/post"
import { Card } from "@chakra-ui/react"
import PostCarousel from "./Carousel"
import Footer from "./Footer"
import Header from "./Header"

export interface PostComponentProps {
  postData: PostProps
}

export default function Post({ postData }: PostComponentProps) {
  return (
    <Card
      bg={"black"}
      border={"0.6px solid limegreen"}
      size="sm"
      boxShadow="none"
      borderRadius="none"
      p={2}
    >
      <PostProvider postData={postData}>
        <Header />
        <PostCarousel />
        <Footer />
      </PostProvider>
    </Card>
  )
}
