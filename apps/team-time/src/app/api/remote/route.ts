import { type D1Database } from '@cloudflare/workers-types';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { type NextRequest, NextResponse } from 'next/server';

interface CloudflareEnv {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  TEAM_TIME_DB: D1Database;
}

interface FileRow {
  content: string;
  version?: number;
}

function getDB(): D1Database {
  const { env } = getCloudflareContext() as unknown as { env: CloudflareEnv };
  return env.TEAM_TIME_DB;
}

function handleError(error: unknown): NextResponse {
  console.error('Database error:', error);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

// --- HANDLERS ---

export async function GET(request: NextRequest) {
  const id = request.headers.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing "id" header' }, { status: 400 });
  }

  try {
    const db = getDB();

    const result = await db
      .prepare('SELECT content FROM files WHERE id = ?')
      .bind(id)
      .first<FileRow>();

    console.log('Database query result:', id);

    if (!result) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ content: result.content });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as { id?: string; text?: string };
    const id = body.id;
    const text = body.text;
    const incomingVersion = parseInt(request.headers.get('X-Config-Version') ?? '1', 10);

    if (!id || !text) {
      return NextResponse.json({ error: 'Invalid or missing id/text' }, { status: 400 });
    }

    const db = getDB();

    // Validar versión para evitar sobreescritura (409 Conflict)
    const existing = await db
      .prepare('SELECT version FROM files WHERE id = ?')
      .bind(id)
      .first<FileRow>();
    if (existing && typeof existing.version === 'number' && existing.version >= incomingVersion) {
      return NextResponse.json(
        { error: 'Version conflict.', remoteVersion: existing.version },
        { status: 409 }
      );
    }

    const { results } = await db
      .prepare(
        'UPDATE files SET content = ?, version = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING id'
      )
      .bind(text, incomingVersion, id)
      .all();

    if (results.length === 0) {
      return NextResponse.json({ error: 'ID not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}

export const POST = PUT;
