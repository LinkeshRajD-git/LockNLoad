// Image upload handler — stores as base64 data URL
// Firebase Storage bucket is not activated, so we embed images directly
// This works immediately without any external storage setup

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileData, fileName, contentType } = req.body;

    if (!fileData || !fileName) {
      return res.status(400).json({ error: 'Missing file data or file name' });
    }

    // Validate the base64 data isn't too large (max ~5MB decoded)
    const estimatedSize = (fileData.length * 3) / 4;
    if (estimatedSize > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image too large. Max 5MB.' });
    }

    // Build the data URL that can be used directly in <img> tags
    const mimeType = contentType || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${fileData}`;

    return res.status(200).json({ url: dataUrl, success: true });
  } catch (error) {
    console.error('Image processing error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process image',
      code: 'unknown',
    });
  }
}
