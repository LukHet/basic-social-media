import Button from "./button";

export default function Share({ onClick, postId }) {
  const handleShareButtonClick = () => {
    onClick && onClick();
  };

  return (
    <Button
      label="Share post"
      onClick={onClick}
      href={`/post-view/${postId}`}
      additionalClass={"!mx-0"}
    ></Button>
  );
}
