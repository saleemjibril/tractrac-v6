import BlogPostDetail from '@/app/components/singleBlogPostInner';
import { graphQLClient } from '../../utils/graphql';
import { JSDOM } from 'jsdom';

interface PostResponse {
  post: {
    id: string;
    title: string;
    content: string;
    slug: string;
    date: string;
    modified: string;
    author: {
      node: {
        name: string;
        avatar: {
          url: string;
        };
        description: string;
        url: string;
      };
    };
    featuredImage: {
      node: {
        sourceUrl: string;
        altText: string;
      };
    };
    toc?: { id: string; content: string }[]; // Add optional TOC field
  };
}

const FetchBlogSlug = async (slug: string) => {
  const postQuery = `
    query PostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        title
        content
        slug
        date
        modified
        author {
          node {
            name
            avatar {
              url
            }
            description
            url
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  `;

  try {
    const variables = { slug };
    const data = await graphQLClient.request<PostResponse>(postQuery, variables);
    const data_content = data.post.content;

    // Parse the HTML content
    const dom = new JSDOM(data_content);
    const document = dom.window.document;

    // Find all elements with data-content="true"
    const elements = document.querySelectorAll('[data-content="true"]');
    //console.log("Elements with data-content=true:", elements);

    // Extract the content or IDs of the elements
    const dataContentElements = Array.from(elements).map((el) => {
      const element = el as HTMLElement;
      return {
        id: element.id,
        content: element.textContent || '', // Provide a fallback for null content
      };
    });
    //console.log("Extracted elements:", dataContentElements);

    // Add the extracted elements to the post object
    return {
      ...data.post,
      toc: dataContentElements, // Add TOC to the post object
    };
  } catch (error) {
    //console.log('Error fetching post:', error);
    return null;
  }
};

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await FetchBlogSlug(params.slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return <BlogPostDetail post={post} />;
}