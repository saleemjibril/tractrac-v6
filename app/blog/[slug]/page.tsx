// app/blog/[slug]/page.tsx
import BlogPostDetail from '@/app/components/singleBlogPostInner';
import { graphQLClient } from '../../utils/graphql';
import { Metadata } from 'next';

// Define types for WordPress data
interface Post {
  id: string;
  title: string;
  content: string;
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

interface PostResponse {
  post: Post;
}

interface MediaResponse {
  mediaItems: {
    edges: {
      node: MediaItem;
    }[];
  };
}

// Function to fetch a single post by slug with matching media
async function getSinglePostBySlug(slug: string) {
  const postQuery = `
    query SinglePost($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        title
        content
        slug
        date
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
    // Fetch post and media items in parallel
    const [postData, mediaData] = await Promise.all([
      graphQLClient.request<PostResponse>(postQuery, { slug }),
      graphQLClient.request<MediaResponse>(mediaQuery)
    ]);

    const post = postData.post;
    const mediaItems = mediaData.mediaItems.edges.map(edge => edge.node);

    // Find matching media for the post
    const matchingMedia = mediaItems.find(media => {
      const postTitle = post.title.toLowerCase();
      const mediaTitle = media.title.toLowerCase();
      
      return (
        mediaTitle.includes(postTitle) || 
        postTitle.includes(mediaTitle) ||
        media.title.includes(post.id)
      );
    });

    // Return the post with the matched media
    return {
      ...post,
      image: matchingMedia?.sourceUrl || '/placeholder-image.jpg',
      imageAlt: matchingMedia?.altText || post.title
    };
  } catch (error) {
    console.error('Error fetching post with media:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getSinglePostBySlug(params.slug);
  
  if (!post) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found."
    };
  }

  const cleanDescription = post.content
    .replace(/<[^>]*>/g, '')
    .substring(0, 200) + '...';
  
  return {
    title: post.title,
    description: cleanDescription,
    openGraph: {
      title: post.title,
      description: cleanDescription,
      type: 'article',
      url: `https://web-v6.onrender.com/blog/${post.slug}`,
      images: [
        {
          url: post.image || 'https://web-v6.onrender.com/default-image.jpg',
          width: 1200,
          height: 630,
          alt: post.imageAlt || post.title,
        },
      ],
      siteName: 'TracTrac',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: cleanDescription,
      images: [post.image || 'https://web-v6.onrender.com/default-image.jpg'],
      creator: '@tractrac',
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getSinglePostBySlug(params.slug);
  
  if (!post) {
    return <div>Post not found</div>;
  }

  return <BlogPostDetail post={post} />;
}