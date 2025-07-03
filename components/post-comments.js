import SingleComment from "./single-comment";

export default function PostComments({
  comments,
  userId,
  deleteComment,
  isOwnPost,
}) {
  const allComments =
    comments.length > 0 ? (
      comments.map((com) => (
        <SingleComment
          key={com.id}
          com={com}
          userId={userId}
          deleteComment={deleteComment}
          isOwnPost={isOwnPost}
        />
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
