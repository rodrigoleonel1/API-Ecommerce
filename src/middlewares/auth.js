const isAdmin = async (req, res, next) =>{
    try {
        const userRole = req.user?.role
        if(userRole == 'admin') return next()
        return res.status(401).render('errors/base', {
            error: 'Only admins can access this route.'   
        })
    } catch (error) {
        console.log(error)
    }
}

const isUser = async (req, res, next) =>{
    try {
        const userRole = req.user?.role
        console.log(userRole)
        if(userRole == 'user') return next() 
        return res.status(401).render('errors/base', {
            error: 'Only users can access this route.'   
        })
    } catch (error) {
        console.log(error)
    }
}

export { isAdmin, isUser }