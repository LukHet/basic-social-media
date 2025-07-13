import Button from "./button";

export default function CopyButton({ onClick, label }) {
  return (
    <Button label={label} onClick={onClick} additionalClass={"!mx-0"}></Button>
  );
}
