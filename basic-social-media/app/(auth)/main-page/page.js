import Image from "next/image";

export default function MainPage() {
  return (
    <>
      <main>
        <div className="main-page relative top-28 max-w-screen-lg p-5 rounded-3xl container mx-auto">
          <Image
            src="/rudy_kotek.jpg"
            alt="Kitty"
            width={300}
            height={300}
            loading="lazy"
            className="p-5 mx-auto rounded-full"
          />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            luctus metus ex, tempus bibendum ipsum faucibus non. Donec pharetra
            interdum tempor. Aenean molestie pharetra tellus a sollicitudin.
            Aliquam mattis eget urna eu commodo. Quisque imperdiet feugiat
            metus, ut suscipit neque luctus et. Phasellus pulvinar dolor augue,
            non porttitor ante feugiat ac. Donec sit amet vehicula massa. Etiam
            nibh mi, placerat in cursus sit amet, ornare fringilla metus. Class
            aptent taciti sociosqu ad litora torquent per conubia nostra, per
            inceptos himenaeos. Praesent in egestas ligula. Nunc ac augue
            mauris. Suspendisse potenti. Nam consequat sem eu mi efficitur
            convallis. Maecenas sollicitudin nisl vel orci sodales fringilla.
            Mauris interdum, augue at imperdiet posuere, neque mi pretium
            ligula, quis semper tellus dolor eu nisi. Donec non ante pharetra,
            pharetra ex a, efficitur elit. Etiam vitae orci turpis. Nulla quis
            est dictum, fringilla velit quis, faucibus felis. Sed rutrum et arcu
            non dictum. Etiam placerat urna lorem, vehicula elementum elit
            scelerisque eget. Donec eget enim mi. Nam nec felis maximus dui
            interdum condimentum rhoncus a sem. Duis sed suscipit mauris.
            Suspendisse congue volutpat nisi in congue. Nunc vehicula dui nec
            orci auctor pharetra. Vestibulum ante ipsum primis in faucibus orci
            luctus et ultrices posuere cubilia curae; Pellentesque vel nulla
            vitae sapien fringilla efficitur. Aenean a sapien nunc. Sed nunc mi,
            malesuada eu varius quis, egestas non mauris. Donec ut dui
            malesuada, laoreet enim ut, sagittis quam. Quisque interdum dictum
            tellus, imperdiet vehicula arcu posuere eget. Fusce accumsan vel
            mauris facilisis commodo. Aliquam efficitur aliquet eros, a
            hendrerit risus. Cras blandit purus mi, vel porttitor eros auctor
            at. Aliquam erat volutpat. Aenean consequat urna sed sem rhoncus
            placerat. Suspendisse porttitor quam porttitor convallis dignissim.
            Phasellus et magna id velit finibus volutpat. Nullam gravida
            molestie gravida. Nam consequat leo eros, ut pellentesque justo
            ornare sit amet. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. In sollicitudin cursus felis. Curabitur consequat tempus felis
            eu ullamcorper. Fusce fermentum vel enim in pellentesque.
            Pellentesque a fringilla dolor, sed commodo sem. Curabitur consequat
            arcu vitae turpis pretium, vel hendrerit ipsum iaculis. Ut id
            facilisis purus. Donec sed sagittis sapien. Aliquam erat volutpat.
            Duis vel sapien condimentum, consectetur libero eu, rutrum arcu.
            Nulla aliquam odio at vestibulum tincidunt. Quisque bibendum in
            sapien eu suscipit. Nam vitae nisi id enim ultricies suscipit.
            Curabitur vestibulum neque nec ligula commodo, et auctor nulla
            auctor. Mauris luctus tortor eget massa blandit, vitae posuere
            libero vulputate. Nunc mollis velit nec varius efficitur. In hac
            habitasse platea dictumst. Aenean sed odio in lectus fringilla
            volutpat et vitae velit. In in ligula diam. Aliquam blandit arcu
            nulla, cursus aliquam felis aliquam dignissim. Donec eget nulla in
            sapien sodales gravida quis eget magna. Integer volutpat, velit in
            lacinia commodo, sem velit elementum sapien, eu fermentum metus nunc
            vel diam. Aliquam accumsan nisl quis euismod faucibus. Sed laoreet
            lacinia libero vel sodales. Aenean consequat est at semper
            fermentum. Etiam quis urna commodo, pulvinar leo ac, venenatis
            turpis. Mauris ac faucibus mauris. Nulla sodales blandit pretium.
            Interdum et malesuada fames ac ante.
          </p>
        </div>
      </main>
    </>
  );
}
