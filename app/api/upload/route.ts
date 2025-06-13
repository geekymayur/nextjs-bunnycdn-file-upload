import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  },
};

const BUNNY_ZONE =process.env.BUNNY_ZONE;
const BUNNY_HOST = process.env.BUNNY_HOST;
const ACCESS_KEY = process.env.BUNNY_ACCESS_KEY!;
const BUNNY_CDN_URL=process.env.BUNNY_CDN_URL;
const uploadDir = path.join(process.cwd(), '/tmp');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

function getNodeReq(request: NextRequest): Promise<any> {
  const readable = Readable.from(request.body as any);
  const headers: Record<string, string> = {};
  request.headers.forEach((v, k) => (headers[k.toLowerCase()] = v));

  return Promise.resolve(
    Object.assign(readable, {
      headers,
      method: request.method,
      url: '',
    })
  );
}

function parseFormData(req: any): Promise<{ files: formidable.Files }> {
  const form = formidable({
    multiples: true, // ✅ enable multiple
    uploadDir,
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, _fields, files) => {
      if (err) return reject(err);
      resolve({ files });
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    const nodeReq = await getNodeReq(req);
    const { files } = await parseFormData(nodeReq);
    const rawFiles = files.file;

    if (!rawFiles) {
      return NextResponse.json({ message: 'No files found' }, { status: 400 });
    }

    const filesArray = Array.isArray(rawFiles) ? rawFiles : [rawFiles];

    const uploadedUrls: string[] = [];

    for (const file of filesArray) {
      if (!file?.filepath || !file?.originalFilename) continue;

      const filename = `${Date.now()}-${file.originalFilename}`;
      const uploadUrl = `https://${BUNNY_HOST}/${BUNNY_ZONE}/test/${filename}`;
      const fileStream = fs.createReadStream(file.filepath);

      await axios.put(uploadUrl, fileStream, {
        headers: {
          AccessKey: ACCESS_KEY,
          'Content-Type': 'application/octet-stream',
        },
        maxBodyLength: Infinity,
      });

      const cdnUrl = `${BUNNY_CDN_URL}/test/${filename}`;
      uploadedUrls.push(cdnUrl);
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json({ message: 'No valid files uploaded' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Upload success', urls: uploadedUrls }, { status: 200 });
  } catch (err) {
    console.error('[UPLOAD ERROR]', err);
    return NextResponse.json({ message: 'Upload failed', error: err }, { status: 500 });
  }
}
