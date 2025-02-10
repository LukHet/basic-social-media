import Link from "next/link";
import Comment from "./comment";
import Like from "./like";
import Image from "next/image";

export default function Post({ post, userId, deletePost }) {
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
        <div className="flex h-fit items-center">
          <p>{post.post_date}</p>
          {post.user_id === userId ? (
            <Image
              className="ml-3 bin"
              src="/bin.png"
              width={32}
              height={32}
              alt="bin"
              onClick={() => deletePost(post.id)}
            />
          ) : null}
        </div>
      </div>
      <div className="mt-5 text-xl">{post.content}</div>
      <Like postId={post.id} userId={userId} />
      <Comment postId={post.id} userId={userId} />
    </div>
  );
}
