"use client";
import AuthorAvatar from "@/components/AuthorAvatar";
import TipButton from "@/components/PostCard/TipButton";
import usePosts from "@/hooks/usePosts";
import {
  getTotalPayout,
  transform3SpeakContent,
  transformEcencyImages,
  transformIPFSContent,
  transformNormalYoutubeLinksinIframes,
  transformShortYoutubeLinksinIframes,
} from "@/lib/utils";
import {
  Badge,
  Box,
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Discussion } from "@hiveio/dhive";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import HTMLFlipBook from "react-pageflip";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Comment } from "../../../app/mainFeed/page";
import { FullMagazineRenderers } from "../FullMagazineRenderers";

const pageStyles = {
  backgroundColor: "black",
  border: "1px solid #ccc",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "20px",
  color: "black",
  overflow: "auto",
  position: "relative",
  height: 100,
};

const flipbookStyles = {
  margin: "0 auto",
  width: "90vw",
  height: "90vh",
  transition: "none",
};

const coverStyles = {
  ...pageStyles,
  backgroundColor: "darkblue",
  color: "white",
  backgroundImage:
    "url(https://gifdb.com/images/high/neon-techno-background-07w3jgqrk7galdgr.gif)",
  backgroundSize: "cover",
  textAlign: "center",
};

const backCoverStyles = {
  ...pageStyles,
  backgroundColor: "darkred",
  color: "white",
  justifyContent: "center",
  alignItems: "center",
  backgroundImage:
    "url(https://media1.giphy.com/media/9ZsHm0z5QwSYpV7g01/giphy.gif?cid=6c09b952uxaerotyqa9vct5pkiwvar6l6knjgsctieeg0sh1&ep=v1_gifs_search&rid=giphy.gif&ct=g)",
  backgroundSize: "cover",
};
const textStyles = {
  position: "absolute",
  bottom: "20px",
  width: "100%",
  textAlign: "center",
  color: "white",
};

export interface TestPageProps {
  tag: { tag: string; limit: number }[];
  query: string;
}

export default function FullMag({ tag, query }: TestPageProps) {
  const { posts, error, isLoading, setQueryCategory, setDiscussionQuery } =
    usePosts(query, tag);
  const flipBookRef = useRef<any>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (flipBookRef.current) {
        if (event.key === "ArrowRight") {
          flipBookRef.current.pageFlip().flipNext();
        } else if (event.key === "ArrowLeft") {
          flipBookRef.current.pageFlip().flipPrev();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" w="100vw" h="100vh" p={5}>
        <Text color={"white"}>Loading...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" w="100%" h="100%" p={5}>
        <Text color={"white"}>Error loading posts</Text>
      </Flex>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <Flex justify="center" align="center" w="100vw" h="100vh" p={5}>
        <Text>No posts available</Text>
      </Flex>
    );
  }

  return (
    <VStack justify="center" align="center" w="100%" h="100vh" p={5}>
      <HTMLFlipBook
        width={1000}
        height={1200}
        minWidth={0}
        maxWidth={1000}
        minHeight={0}
        maxHeight={750}
        startPage={0}
        size="stretch"
        drawShadow
        flippingTime={1000}
        usePortrait
        startZIndex={0}
        autoSize={true}
        maxShadowOpacity={0.5}
        showCover={false}
        mobileScrollSupport
        swipeDistance={30}
        clickEventForward
        useMouseEvents
        renderOnlyPageLengthChange={false}
        showPageCorners
        disableFlipByClick={false}
        className="flipbook"
        style={flipbookStyles}
        ref={flipBookRef}
      >
        <Box sx={coverStyles}>
          <Flex direction="column" align="center" justify="center">
            <Heading>
              <Image src="/skatehive-banner.png" alt="SkateHive Logo" />
            </Heading>
            <Center m={20}>
              <Image
                boxSize={"auto"}
                src="/skatehive_square_green.png"
                alt="SkateHive Logo"
              />
            </Center>
            <Box
              m={5}
              borderRadius={5}
              backgroundColor={"black"}
              sx={textStyles}
            >
              <Text fontSize={"12px"} color="white">
                Welcome to the {String(tag[0].tag)} Magazine
              </Text>
              <Text fontSize={"12px"} color="white">
                A infinity mag created by skaters all over the world.
              </Text>
            </Box>
          </Flex>
        </Box>
        {posts.map((post: Discussion) => (
          <Box key={post.id} sx={pageStyles}>
            <HStack spacing={2}>
              <VStack bg="#0c0c0d" p={2} borderRadius={5} width={"20%"}>
                <AuthorAvatar username={post.author} boxSize={20} borderRadius={100} />
                <Text color={"white"} mt={0}>
                  {post.author}
                </Text>

              </VStack>
              <Text
                fontSize={'26px'}
                color={"white"}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {post.title}
              </Text>
            </HStack>

            <Divider mt={4} mb={4} />
            <ReactMarkdown
              key={post.id}
              className="page"
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={FullMagazineRenderers}
            >
              {transform3SpeakContent(
                transformIPFSContent(
                  transformEcencyImages(
                    transformNormalYoutubeLinksinIframes(
                      transformShortYoutubeLinksinIframes(post.body),
                    ),
                  ),
                ),
              )}
            </ReactMarkdown>
            <Divider mt={4} mb={4} />
            <Flex justifyContent={"space-between"}>
              <Badge colorScheme="green" variant={"outline"} h={"30px"} width={"20%"}>
                <Center>
                  <Text fontSize={'22px'}> ${Number(getTotalPayout(post as Comment)).toFixed(2)}</Text>
                </Center>
              </Badge>
              <Badge colorScheme="green" variant={"outline"} mt={2}>

                <Text color={"white"} fontSize={"16px"}>
                  {new Date(post.created).toLocaleDateString()}
                </Text>
              </Badge>
            </Flex>
            <Text>Pending Payout: {post.pending_payout_value.toString()}</Text>
          </Box>
        ))}
        <Box sx={backCoverStyles}>
          <Heading>Back Cover</Heading>
          <Text>Thrasher my ass!</Text>
        </Box>
      </HTMLFlipBook>
    </VStack>
  );
}
