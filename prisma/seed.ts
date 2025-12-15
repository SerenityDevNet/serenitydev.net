import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // REPLACE THIS WITH YOUR TWITCH UID from the previous step
  const myTwitchId = "547329691" 
  const myName = "Serenity_Dev"

  // 1. Ensure the user exists
  const user = await prisma.user.upsert({
    where: { id: myTwitchId },
    update: {},
    create: {
      id: myTwitchId,
      name: myName,
    },
  })

  // 2. Give them a toy
  const toy = await prisma.toy.create({
    data: {
      name: "Developer's Ban Hammer",
      type: "Legendary Weapon",
      userId: user.id,
    },
  })

  console.log("🎁 Gifted toy to:", user.name)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })