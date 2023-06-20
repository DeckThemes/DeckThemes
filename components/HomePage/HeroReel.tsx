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
      <div className="relative h-96 sm:h-96 mt-16 sm:mt-24">
        <div className="img-section flex justify-center gap-5 overflow-visible sm:gap-8 py-4 px-4">
          {imageNames.map((imageName, index) => (
            <div
              key={index}
              className={`border-2 border-borders-base1-light dark:border-borders-base1-dark img-shadow group transition relative aspect-[16/10] flex-none overflow-hidden rounded-xl bg-[#27272a] dark:bg-zinc-800 w-[32rem] sm:rounded-2xl ${getRandomRotationClass()}`}
            >
              <Image src={`/hero/${imageName}`} alt={`Hero Image ${index + 1}`} fill={true} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
