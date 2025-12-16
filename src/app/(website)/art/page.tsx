import Image from "next/image";

const GamesPage = () => {
  return (
    <div className="sm:p-20">
        <main className="flex flex-col gap-[50px] items-center text-[300%]">
        <h1>3D Renders:</h1>
        <ul className="row-start-3 flex gap-[0px] flex-wrap items-center justify-center">
            <li><Image src="/images/art/toymaker.png" alt="Toymaker from Wretched Rose" style={{ width: 'auto', height: 400}} width={2086} height={2086} priority/></li>
            <li><Image src="/images/art/jester.jpg" alt="Jester Dimension" style={{ width: 'auto', height: 400}} width={1280} height={960} priority/></li>
            <li><Image src="/images/art/bear.jpg" alt="Torn Bear" style={{ width: 'auto', height: 400}} width={1024} height={896} priority/></li>
            <li><Image src="/images/art/uwasa.jpg" alt="Uwasa Labyrinth from Magia Record" style={{ width: 'auto', height: 400}} width={1024} height={896} priority/></li>
            <li><Image src="/images/art/reapnsow.jpg" alt="Reap What You Sow Gameplay mockup" style={{ width: 'auto', height: 400}} width={1280} height={960} priority/></li>
            <li><Image src="/images/art/flandre.jpg" alt="Flandre's Wings" style={{ width: 'auto', height: 400}} width={1280} height={960} priority/></li>
            <li><Image src="/images/art/misty_lake.jpg" alt="Misty Lake from Touhou as a MKDS course" style={{ width: 'auto', height: 400}} width={1280} height={960} priority/></li>
        </ul>
        <h1>2D Art:</h1>
        <ul className="row-start-3 flex gap-[0px] flex-wrap items-center justify-center">
            <li>Coming soon</li>
        </ul>
        </main>
    </div>
  );
};

export default GamesPage;