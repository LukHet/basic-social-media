import Link from "next/link";

export default function PostLikesPopup({ closePopup, likes }) {
  return (
    <div className="fixed inset-0 z-50 pt-24 w-full h-full overflow-auto bg-black bg-opacity-40">
      <div className="main-page min-w-80 rounded-3xl p-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h2 className="text-xl text-center">Likes</h2>
        <div
          className="cursor-pointer w-fit p-1 border-2 border-black float-right -top-[25px] relative rounded-3xl"
          onClick={closePopup}
        >
          X
        </div>
        <div className="mt-5 p-2">
          {likes &&
            likes.length > 0 &&
            likes.map((el) => (
              <Link
                key={el.id}
                href={`/profile/${el.user_id}`}
                className="button border-black border-2 p-1 rounded-xl post-author w-fit flex gap-2 align-center pt-2"
              >
                {el.author}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
