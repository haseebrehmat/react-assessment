import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

type RouteParams = { params: { id: string } };

export async function GET(_: Request, { params }: RouteParams) {
  try {
    const post = await db.post.findUnique({ where: { id: params.id } });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const body = await request.json();
    const { title, content, published } = body ?? {};
    if (title && typeof title !== 'string') {
      return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
    }

    const post = await db.post.update({
      where: { id: params.id },
      data: {
        title: typeof title === 'string' ? title.trim() : undefined,
        content: typeof content === 'string' ? content : undefined,
        published: typeof published === 'boolean' ? published : undefined,
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: RouteParams) {
  try {
    await db.post.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}


