import SinglePost from "@/components/single-post";

export default async function PostView({ params }) {
  const par = await params;
  return (
    <div className="main-page mt-28 max-w-screen-lg p-5 rounded-3xl container mx-auto">
      <SinglePost postId={par.slug} />
    </div>
  );
}
