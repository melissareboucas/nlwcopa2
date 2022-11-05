import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'Melissa2',
            email: 'melissa2.mnrv@gmail.com',
            avatarUrl: 'https://github.com/melissareboucas.png'
        }
    })

    const pool = await prisma.pool.create({
        data: {
            title: '3 bolao da Mel',
            code: '123456',
            ownerId: user.id,

            participants: {
                create: {
                    userId: user.id
                }
            }
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-24T12:00:00201Z',
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'AR'
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-30T12:00:00201Z',
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'CH',

            guesses: {
                create: {
                    firstTeamPoints: 3,
                    secondTeamPoints: 0,

                    participant: {
                        connect: {
                            userId_poolId: {
                                userId: user.id,
                                poolId: pool.id
                            }
                        }
                    }
                }
            }
        }
    })
}

main()