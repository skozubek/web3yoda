import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import type { ToolEcosystem, ToolCategory, ToolStatus } from '@/content/config';

// Type guard functions for parameter validation
function isValidEcosystem(value: string | null): value is ToolEcosystem | 'all' {
  if (!value) return false;
  return ['all', 'bitcoin', 'ethereum', 'solana', 'multichain', 'other'].includes(value);
}

function isValidCategory(value: string | null): value is ToolCategory | 'all' {
  if (!value) return false;
  return ['all', 'wallets', 'marketplaces', 'defi', 'infrastructure', 'security', 'analytics', 'other'].includes(value);
}

function isValidStatus(value: string | null): value is ToolStatus | 'all' {
  if (!value) return false;
  return ['all', 'active', 'beta', 'deprecated'].includes(value);
}

// Constants
const ITEMS_PER_PAGE = 24;

export const GET: APIRoute = async ({ url }) => {
  try {
    // Get and validate query parameters
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const ecosystemParam = url.searchParams.get('ecosystem');
    const categoryParam = url.searchParams.get('category');
    const statusParam = url.searchParams.get('status');

    // Validate filter parameters
    const ecosystem = isValidEcosystem(ecosystemParam) ? ecosystemParam : 'all';
    const category = isValidCategory(categoryParam) ? categoryParam : 'all';
    const status = isValidStatus(statusParam) ? statusParam : 'all';

    // Fetch all tools
    let tools = await getCollection('tools');

    // Apply filters
    if (ecosystem !== 'all') {
      tools = tools.filter(tool => 
        tool.data.ecosystems.includes(ecosystem as ToolEcosystem)
      );
    }
    if (category !== 'all') {
      tools = tools.filter(tool => 
        tool.data.category === category
      );
    }
    if (status !== 'all') {
      tools = tools.filter(tool => 
        tool.data.status === status
      );
    }

    // Calculate pagination
    const total = tools.length;
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    // Get paginated tools
    const paginatedTools = tools.slice(start, end);

    // Return success response
    return new Response(
      JSON.stringify({
        tools: paginatedTools,
        pagination: {
          total,
          totalPages,
          currentPage,
          itemsPerPage: ITEMS_PER_PAGE,
          hasNextPage: currentPage < totalPages,
          hasPreviousPage: currentPage > 1
        },
        filters: {
          ecosystem,
          category,
          status
        }
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          // Cache for 1 hour by default, but allow revalidation
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate'
        }
      }
    );

  } catch (error) {
    console.error('Error in tools API:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}