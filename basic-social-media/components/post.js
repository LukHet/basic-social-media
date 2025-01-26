import Link from "next/link";
import Comment from "./comment";

export default function Post({ post }) {
  const href = `/profile/${post.user_id}`;
  return (
    <div className="main-page mt-5 max-w-screen-lg py-5 px-10 rounded-3xl container mx-auto post">
      <div className="flex justify-between">
        <Link
          href={href}
          className="button border-black border-2 p-1 rounded-xl post-author flex gap-2 align-center pt-2"
        >
          {post.author}
        </Link>
        <p>{post.post_date}</p>
      </div>
      <div className="mt-5 text-xl">{post.content}</div>
      <Comment />
    </div>
  );
}
