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

const BUNNY_ZONE = 'mayurx-1';
const BUNNY_HOST = 'storage.bunnycdn.com'; // or specific region hostname
const ACCESS_KEY = process.env.BUNNY_ACCESS_KEY!;
const uploadDir = path.join(process.cwd(), '/tmp'); // temp storage

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
        multiples: false,
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
        console.log('FILES:', files); // 🪵 log this

        const file = files.file as formidable.File;
        console.log("myfile",file[0].filepath);

        if (!file[0] || !file[0].filepath || !file[0].originalFilename) {
            console.log('Invalid Files');
            return NextResponse.json({ message: 'Invalid file', debug: files }, { status: 400 });
        };

        const filename = `${Date.now()}-${file[0].originalFilename}`;
        const uploadUrl = `https://${BUNNY_HOST}/${BUNNY_ZONE}/test/${filename}`;
        const fileStream = fs.createReadStream(file[0].filepath);

      await axios.put(uploadUrl, fileStream, {
            headers: {
                AccessKey: ACCESS_KEY,
                'Content-Type':'application/octet-stream',
            },
          
        });
            let cdnurl = `https://mayurx.b-cdn.net/test/${filename}`
       

        return NextResponse.json({ message: 'Upload success', url: cdnurl },{status:200});
    } catch (err) {
        console.error('[UPLOAD ERROR]', err);
        return NextResponse.json({ message: 'Upload failed', error: err }, { status: 500 });
    }
}
