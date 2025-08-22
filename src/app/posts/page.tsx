'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

type Post = {
  id: string;
  title: string;
  content: string | null;
  published: boolean;
  createdAt: string;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [filter, setFilter] = useState('');

  const filteredPosts = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) return posts;
    return posts.filter(p => p.title.toLowerCase().includes(query));
  }, [posts, filter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data.posts ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), content: content.trim() || null, published }),
      });
      if (res.ok) {
        setTitle('');
        setContent('');
        setPublished(false);
        await fetchPosts();
      }
    } finally {
      setLoading(false);
    }
  };

  const removePost = async (id: string) => {
    setLoading(true);
    try {
      await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      await fetchPosts();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch id="published" checked={published} onCheckedChange={setPublished} />
              <label htmlFor="published" className="text-sm">Published</label>
            </div>
            <Button onClick={createPost} disabled={loading || !title.trim()} className="max-sm:w-full">Add</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Filter by title..." value={filter} onChange={(e) => setFilter(e.target.value)} />
          <Separator />
          <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
            {filteredPosts.map((p) => (
              <div key={p.id} className="border rounded p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium line-clamp-1">{p.title}</h3>
                  <Button variant="destructive" onClick={() => removePost(p.id)} size="sm">Delete</Button>
                </div>
                {p.content ? <p className="text-sm text-muted-foreground line-clamp-3">{p.content}</p> : null}
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>{p.published ? 'Published' : 'Draft'}</span>
                  <span>{new Date(p.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
            {filteredPosts.length === 0 && (
              <p className="text-sm text-muted-foreground">No posts</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


