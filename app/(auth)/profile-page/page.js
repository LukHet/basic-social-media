import ProfileInfo from "@/components/profile-info";
import ProfilePosts from "@/components/profile-posts";

export default function ProfilePage() {
  return (
    <>
      <main>
        <ProfileInfo isOwnProfile={true} />
        <ProfilePosts isOwnProfile={true} />
      </main>
    </>
  );
}
