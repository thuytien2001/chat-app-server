import Prisma1, * as Prisma2 from "@prisma/client";

const Prisma = Prisma1 || Prisma2;
const myPrisma = new Prisma.PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

myPrisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params)
  console.log('Duration: ' + e.duration + 'ms')
})

export { myPrisma }