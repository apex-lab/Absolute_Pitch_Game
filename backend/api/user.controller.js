import absolutepitchDAO from "../dao/absolutepitchDAO.js";
console.log(absolutepitchDAO);

export default class UserCtrl { 
    static async apiGetUsers(req,res,next) { 
        const usersPerPage = req.query.usersPerPage ? parseInt(req.query.resaurantsPerPage, 10) : 20 
        const page = req.query.page ? parseInt(req.query.page, 10):0

        let filters = {}
        if(req.query.level) { 
            filters.level = req.query.level
        } else if (req.query.iterations) { 
            filters.iterations = requ.query.iterations
        } else if (req.query.users) { 
            filters.users = req.query.users
        }
        const {userList, totalUsers} = await absolutepitchDAO.getUsers({ 
            filters,
            page, 
            usersPerPage
        })
        let response = { 
            users: userList,
            page: page, 
            filters: filters,
            entries_per_page:usersPerPage,
            total_results: totalUsers
        }
        res.json(response)
    }
}