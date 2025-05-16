import { graphQLClient } from '../utils/graphql';

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

        // console.log("mediaItems", mediaItems);
        // console.log("posts", posts);

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