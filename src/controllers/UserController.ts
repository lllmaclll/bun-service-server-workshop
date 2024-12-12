import { PrismaClient } from "@prisma/client";
import { password } from "bun";

const prisma = new PrismaClient()

export const UserController = {
    signIn: async ({ body, jwt }: {
        body: {
            username: string,
            password: string
        },
        jwt: any
    }) => {
        try {
            const user = await prisma.user.findUnique({
                select: {
                    id: true,
                    username: true,
                    level: true
                },
                where: {
                    username: body.username,
                    password: body.password,
                    status: "active"
                }
            })

            if (!user) {
                return { message: "Invalid username or password" }
            }

            const token = await jwt.sign(user)

            return { user, token }
        } catch (error) {
            return error
        }
    },
    update: async ({ body, request, jwt }: {
        body: {
            username: string,
            password: string
        },
        request: any,
        jwt: any
    }) => {
        try {
            const headers = request.headers.get("Authorization")
            const token = headers?.split(" ")[1]
            const payload = await jwt.verify(token)
            const id = payload.id
            const oldUser = await prisma.user.findUnique({
                where: { id }
            })
            const newData = {
                username: body.username,
                password: body.password ?? oldUser?.password
            }

            await prisma.user.update({
                where: { id },
                data: newData
            })

            return { message: "success" }
        } catch (error) {
            return error
        }
    },
    list: async () => {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    username: true,
                    level: true
                },
                where: {
                    status: 'active'
                },
                orderBy: {
                    id: 'desc'
                }
            })

            return users
        } catch (error) {
            return error
        }
    },
    createUser: async ({ body }: {
        body: {
            username: string,
            password: string,
            level: string;
        }
    }) => {
        try {
            await prisma.user.create({
                data: body
            })

            return { message: "success" }
        } catch (error) {
            return error
        }
    },
    updateUser: async ({ body, params }: {
        body: {
            username: string;
            password: string;
            level: string;
        },
        params: {
            id: string
        }
    }) => {
        try {
            const oldUser = await prisma.user.findUnique({
                select: {
                    password: true
                },
                where: {
                    id: parseInt(params.id)
                }
            })

            const newData = {
                username: body.username,
                password: body.password ?? oldUser?.password,
                level: body.level
            }

            await prisma.user.update({
                where: {
                    id: parseInt(params.id)
                },
                data: newData
            })

            return { message: "success" }
        } catch (error) {
            return error
        }
    }
}