import Image from "next/image";

export function HeroReel() {
  const imageNames = [
    "hero_reel.png",
    "hero_reel15.png",
    "hero_reel9.png",
    "hero_reel8.png",
    "hero_reel5.png",
    "hero_reel6.png",
  ];

  const getRandomRotationClass = () => {
    const rotations = ["rotate-2", "-rotate-2"];
    const randomIndex = Math.floor(Math.random() * rotations.length);
    return rotations[randomIndex];
  };

  return (
    <>
      <div className="relative mt-16 h-96 max-w-[100vw] overflow-hidden sm:mt-24 sm:h-96">
        <div className="img-section flex justify-center gap-5 overflow-visible py-4 px-4 sm:gap-8">
          {imageNames.map((imageName, index) => (
            <div
              key={index}
              className={`img-shadow group relative aspect-[16/10] w-[32rem] flex-none overflow-hidden rounded-xl border-2 border-borders-base1-light bg-[#27272a] transition dark:border-borders-base1-dark dark:bg-zinc-800 sm:rounded-2xl ${getRandomRotationClass()}`}
            >
              <Image
                src={`/hero/${imageName}`}
                alt={`Hero Image ${index + 1}`}
                fill={true}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
