import ProfileInfo from "@/components/profile-info";
import ProfilePosts from "@/components/profile-posts";

export default async function UserProfilePage({ params }) {
  const par = await params;
  return (
    <>
      <main>
        <ProfileInfo isOwnProfile={false} slug={par.slug} />
        <ProfilePosts isOwnProfile={false} slug={par.slug} />
      </main>
    </>
  );
}
