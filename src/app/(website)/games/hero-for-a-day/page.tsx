import ItchioEmbed from "@/app/(website)/components/ItchioEmbed";

const HeroForADayPage = () => {
  return (
    <div className="sm:p-20">
        <main className="flex flex-col gap-[50px] items-center text-lg/10">
        <h1><a href="https://serenitydev.itch.io/hero-for-a-day">Hero for a Day</a></h1>
        <h2>Comedic 2D Puzzle Platformer</h2>
        <p>JOIN ME IN BESMIRCHING THAT USELESS HERO'S NAME!</p>
        <ItchioEmbed
            src="https://itch.io/embed/2157443?dark=true"
            width="552"
            height="167"
            title="Hero for a Day by SerenityDev"
          />
      </main>
    </div>
  );
};

export default HeroForADayPage;