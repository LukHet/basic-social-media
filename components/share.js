import Button from "./button";

export default function ShareButton({ onClick, postId, label }) {
  return (
    <Button
      label={label}
      onClick={onClick}
      href={`/post-view/${postId}`}
      additionalClass={"!mx-0"}
    ></Button>
  );
}
