const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
export const RepairRecordController = {
    list: async () => {
        try {
            const repairRecords = await prisma.repairRecord.findMany({
                include: {
                    device: true,
                    user: true
                },
                orderBy: {
                    id: "desc"
                }
            });

            let list = []

            for (const repairRecord of repairRecords) {
                if (repairRecord.engineerId) {
                    const engineer = await prisma.user.findUnique({
                        select: {
                            username: true
                        },
                        where: {
                            id: repairRecord.engineerId
                        }
                    })
    
                    list.push({ ...repairRecord, engineer })
                } else {
                    list.push(repairRecord)
                }
            }
            
            return list;
        } catch (error) {
            return error;
        }
    },
    create: async ({ body, request, jwt }: {
        body: {
            customerName: string;
            customerPhone: string;
            deviceName: string;
            deviceId?: number;
            deviceBarcode: string;
            deviceSerial?: string;
            problem: string;
            solving?: string;
            expireDate?: Date;
        },
        request: any,
        jwt: any
    }) => {
        try {
            const row = await prisma.repairRecord.create({
                data: body
            });

            return { message: "success", row: row };
        } catch (error) {
            return error;
        }
    },
    update: async ({ body, params }: {
        body: {
            customerName: string;
            customerPhone: string;
            deviceName: string;
            deviceId?: number;
            deviceBarcode: string;
            deviceSerial?: string;
            problem: string;
            solving?: string;
            expireDate?: Date;
        },
        params: {
            id: string
        }
    }) => {
        try {
            await prisma.repairRecord.update({
                where: {
                    id: parseInt(params.id)
                },
                data: body
            });

            return { message: "success" };
        } catch (error) {
            return error;
        }
    },
    remove: async ({ params }: {
        params: {
            id: string
        }
    }) => {
        try {
            await prisma.repairRecord.update({
                where: {
                    id: parseInt(params.id)
                },
                data: {
                    status: "inactive"
                }
            });

            return { message: "success" };
        } catch (error) {
            return error;
        }
    },
    updateStatus: async ({ body, params }: {
        body: {
            status: string;
            solving: string;
            engineerId: number;
        },
        params: {
            id: string
        }
    }) => {
        try {
            await prisma.repairRecord.update({
                where: {
                    id: parseInt(params.id)
                },
                data: body
            });

            return { message: "success" };
        } catch (error) {
            return error;
        }
    },
    receive: async ({ body }: {
        body: {
            amount: number;
            id: number;
        }
    }) => {
        try {
            await prisma.repairRecord.update({
                where: {
                    id: body.id
                },
                data: {
                    amount: body.amount,
                    payDate: new Date(),
                    status: "complete"
                }
            })

            return { message: "success" }
        } catch (error) {
            return error;
        }
    },
    report: async ({ params }: {
        params: {
            startDate: string;
            endDate: string;
        }
    }) => {
        try {
            const startDate = new Date(params.startDate)
            const endDate =  new Date(params.endDate)

            startDate.setHours(0, 0, 0, 0)
            endDate.setHours(23, 59, 59, 999)

            const repairRecords = await prisma.repairRecord.findMany({
                where: {
                    payDate: {
                        gte: startDate,
                        lte: endDate
                    },
                    status: "complete"
                }
            })

            return repairRecords
        } catch (error) {
            return error
        }
    },
    dashboard: async () => {
        try {
            const totalRepairRecords = await prisma.repairRecord.count()
            const totalRepairRecordComplete = await prisma.repairRecord.count({
                where: {
                    status: "complete"
                }
            })
            const totalRepairRecordNotComplete = await prisma.repairRecord.count({
                where: {
                    status: {
                        not: "complete"
                    }
                }
            })
            const totalAmount = await prisma.repairRecord.aggregate({
                _sum: {
                    amount: true
                },
                where: {
                    status: "complete"
                }
            })

            return { 
                totalRepairRecords: totalRepairRecords,
                totalRepairRecordComplete: totalRepairRecordComplete,
                totalRepairRecordNotComplete: totalRepairRecordNotComplete,
                totalAmount: totalAmount._sum.amount
            }
        } catch (error) {
            return error
        }
    }
}