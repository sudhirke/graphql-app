const queries ={}

const mutations = {
    createUser: async (parent:any, args:any, context:any, info:any) => {
        const {firstName,lastName,email,password} = args;
        //create user in the database
        const user = await context.prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password
            }
        });
        return `User ${user.firstName} ${user.lastName} created successfully`;
    }
}

export const resolvers = {queries,mutations}