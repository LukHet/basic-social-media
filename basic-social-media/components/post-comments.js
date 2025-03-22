import Link from "next/link";
import Image from "next/image";

export default function PostComments({
  comments,
  userId,
  deleteComment,
  isOwnPost,
}) {
  const allComments =
    comments.length > 0 ? (
      comments.map((com) => (
        <div key={com.id} className="mt-3 border-black border-2 p-3 rounded-xl">
          <div className="flex justify-between">
            <Link
              href={`/profile/${com.user_id}`}
              className="button border-black border-2 p-1 w-fit rounded-xl post-author flex gap-2 align-center pt-2"
            >
              {com.author}
            </Link>
            <div className="flex h-fit items-center">
              <p>{com.comment_date}</p>
              {com.user_id === userId || isOwnPost ? (
                <Image
                  className="ml-3 bin"
                  src="/bin.png"
                  width={32}
                  height={32}
                  alt="bin"
                  onClick={() => deleteComment(com.id)}
                />
              ) : null}
            </div>
          </div>
          <p className="mt-2">{com.content}</p>
        </div>
      ))
    ) : (
      <p className="mt-3">There are no comments yet!</p>
    );

  return (
    <div className="mt-8">
      <h1 className="font-bold">Comments</h1>
      <>{allComments}</>
    </div>
  );
}
