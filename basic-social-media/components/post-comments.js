import Link from "next/link";

export default function PostComments({ comments }) {
  const allComments =
    comments.length > 0
      ? comments.map((com) => (
          <div
            key={com.id}
            className="mt-3 border-black border-2 p-3 rounded-xl"
          >
            <Link
              href={`/profile/${com.user_id}`}
              className="button border-black border-2 p-1 w-fit rounded-xl post-author flex gap-2 align-center pt-2"
            >
              {com.author}
            </Link>
            <p className="mt-2">{com.content}</p>
          </div>
        ))
      : null;

  return (
    <div className="mt-8">
      <h1 className="font-bold">Comments</h1>
      <>{allComments}</>
    </div>
  );
}
