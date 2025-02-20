import TextInput from "./text-input";
import Button from "./button";

export default function Chat({ chatParameters }) {
  const senderId = chatParameters.slug.split("-")[0];
  const receiverId = chatParameters.slug.split("-")[1];

  return (
    <>
      <div className="main-page mt-28 max-w-screen-lg p-5 rounded-3xl container mx-auto h-[70vh]"></div>
      <div className="main-page fixed w-full max-w-screen-lg bottom-0 fixed-centered left-[50%] flex">
        <TextInput additionalClass={"w-[90%]"} />
        <Button label="Send" additionalClass={"w-[10%] h-[40px] mt-0"} />
      </div>
    </>
  );
}
