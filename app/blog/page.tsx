import BlogInner from "../components/blogInner";




// app/blog/page.tsx
import { graphQLClient } from '../utils/graphql';

// Define types for WordPress post data
interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
}

interface PostsResponse {
  posts: {
    nodes: Post[];
  };
}

async function getPosts() {
  const query = `
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
              mediaDetails {
                width
                height
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await graphQLClient.request<PostsResponse>(query);
    return data.posts.nodes;
  } catch (error) {
    console.error('Error fetching posts:', error);
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

  const posts = await getPosts();

  console.log("myPosts", posts);

  return (
    <>
    <BlogInner posts={posts} />
    </>
  );
}


