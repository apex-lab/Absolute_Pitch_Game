let users

export default class absolutepitchDAO { 
    static async injectDB(conn) { 
        if (users) { 
            return
        } try { 
            users = await conn.db(process.env.ABSOLUTEPITCH_NS).collection("Users")
        } catch(e) { 
            console.error ( 
                `Couldn't establish a collection handle in AbsolutePitch: ${e}`, 
            )
        }
    }
    static async getUsers({ 
        filters = null, 
        page = 0, 
        usersPerPage = 20,

    } = {}) { 
        let query 
        if (filters) { 
            if ("username" in filters) { 
                query = {$text : { $search : filters["username"]}}
            }
        }

        let cursor

        try { 
            cursor = await users
                .find(query) 
        } catch (e) { 
            console.error(`unable to issue find command, ${e}`)
            return{userList:[], totalUsers: 0}
        }
        const displayCursor = cursor.limit(usersPerPage).skip(usersPerPage * page)
        try { 
            const userList = await displayCursor.toArray() 
            const totalUsers = await users.countDocuments(query)

            return { userList, totalUsers}
        } catch (e) { 
            console.error ( 
                `unable to convert cursor to array or problem counting documents, ${e}`
            )
            return {userList: [], totalUsers: 0}
        }
    } 
}

