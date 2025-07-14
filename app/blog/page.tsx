
// app/blog/page.tsx
import { graphQLClient } from '../utils/graphql';
import BlogInner from "../components/blogInner";

// Define types for WordPress data
interface Post {
  posts: {
    nodes: {
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
    }[];
  };
}
 

// Define the function to fetch posts with media
async function getPostsWithMedia() {
  const postsQuery = ` 
    query AllPosts {
      posts(first: 100) {
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
    const postsData = await graphQLClient.request<Post>(postsQuery);
    return postsData.posts.nodes;
  } catch (error) {
    console.log('Error fetching posts with media:', error);
    return [];
  }
}

export async function generateMetadata() {
  return {
    title: "Blog",
    description:
      "Facilitatings access to mechanization services for all farmers in Africa.",
  };
}


export default async function BlogPosts() {
  // Call the defined function to fetch posts with media
  const postsWithMedia = await getPostsWithMedia();

  return (
    <>
      <BlogInner posts={postsWithMedia} />
    </>
  );
}
