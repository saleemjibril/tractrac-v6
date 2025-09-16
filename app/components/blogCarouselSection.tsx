import BlogCarousel from "./blogCarousel";
import { graphQLClient } from "../utils/graphql";
import { ChakraWrapper } from "../chakraUIWrapper";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
}

async function getPostsWithMedia(): Promise<Post[]> {
  const postsQuery = `
    query AllPosts {
      posts(first: 12) {
        nodes {
          id
          title
          excerpt
          slug
          date
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  `;

  try {
    const postsData = await graphQLClient.request<{ posts: { nodes: Post[] } }>(postsQuery);
    return postsData.posts.nodes;
  } catch (error) {
    console.log("Error fetching posts for carousel:", error);
    return [];
  }
}

export default async function BlogCarouselSection() {
  const posts = await getPostsWithMedia();
  if (!posts || posts.length === 0) return null;
  return (
    <ChakraWrapper>
      <BlogCarousel posts={posts} heading="Insights on Agricultural Mechanization" />
    </ChakraWrapper>
  );
}


