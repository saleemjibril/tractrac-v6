import { graphQLClient } from '../utils/graphql';

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

export default async function relatedBlogs(blogId : string) {
    const blogList = await getPostsWithMedia();
    let relatedList = blogList.filter(blog => blog.id !== blogId);
  
    if(relatedList.length > 3){
      relatedList.slice(0,3);
    }
    return relatedList;
}