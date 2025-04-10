
// app/blog/page.tsx
import { graphQLClient } from '../utils/graphql';
import BlogInner from "../components/blogInner";

// Define types for WordPress data
interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  image?: string;
  imageAlt?: string;
}

interface MediaItem {
  id: string;
  title: string;
  altText: string;
  sourceUrl: string;
}

interface PostsResponse {
  posts: {
    nodes: Post[];
  };
}

interface MediaResponse {
  mediaItems: {
    edges: {
      node: MediaItem;
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
        }
      }
    }
  `;
  
  const mediaQuery = `
    query AllMedia {
      mediaItems(first: 100) {
        edges {
          node {
            id
            title
            altText
            sourceUrl
          }
        }
      }
    }
  `;

  try {
    // Fetch both posts and media items in parallel
    const [postsData, mediaData] = await Promise.all([
      graphQLClient.request<PostsResponse>(postsQuery),
      graphQLClient.request<MediaResponse>(mediaQuery)
    ]);

    const posts = postsData.posts.nodes;
    const mediaItems = mediaData.mediaItems.edges.map(edge => edge.node);

            console.log("mediaItems", mediaItems);
        console.log("posts", posts);

    // Match media items to posts
    const postsWithMedia = posts.map(post => {
      const matchingMedia = mediaItems.find(media => { 
        // console.log("media", media);
        // console.log("post", post);
               
        return (
          media?.title === post.title
        );
      });

      // console.log("matchingMedia", matchingMedia);
      

      return {
        ...post,
        image: matchingMedia?.sourceUrl || '/placeholder-image.jpg',
        imageAlt: matchingMedia?.altText || post.title
      };
    });

    return postsWithMedia;
  } catch (error) {
    console.error('Error fetching posts with media:', error);
    return [];
  }
}

export async function generateMetadata() {
  return {
    title: "Blog",
    description:
      "Facilitating access to mechanization services for all farmers in Africa.",
  };
}

export default async function BlogPosts() {
  // Call the defined function to fetch posts with media
  const postsWithMedia = await getPostsWithMedia();
  
  console.log("myPosts", postsWithMedia);

  return (
    <>
      <BlogInner posts={postsWithMedia} />
    </>
  );
}