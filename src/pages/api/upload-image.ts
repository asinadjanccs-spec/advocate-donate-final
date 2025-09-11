// This will be served as a Vercel serverless function
import { put } from '@vercel/blob';

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const filename = formData.get('filename') as string;

    if (!filename || !file) {
      return new Response(JSON.stringify({ error: 'Missing filename or file data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get the blob token from environment variables
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (!blobToken) {
      return new Response(JSON.stringify({ error: 'Blob storage not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Upload to Vercel blob storage
    const blob = await put(filename, file, {
      access: 'public',
      token: blobToken,
    });

    return new Response(JSON.stringify({ url: blob.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error uploading to blob:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to upload image' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
