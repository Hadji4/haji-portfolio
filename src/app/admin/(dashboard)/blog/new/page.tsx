import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { createPost } from "../actions";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="font-display mb-6 text-2xl font-bold text-foreground">New Post</h1>
      <BlogPostForm action={createPost} />
    </div>
  );
}
