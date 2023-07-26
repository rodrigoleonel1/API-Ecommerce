import passport from "passport";

export const passportCall = (strategy, role) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) {
                return next(err)
            }
            if (!req.user) {
                return res.status(401).render('errors/base', {
                    error: 'Debes iniciar sesión para acceder a esta ruta.',
                    title: 'Ecommerce | Error',
                    route: 'login',
                    page: 'log-in'
                })
            }
            if (!user) {
                return res.status(401).render('errors/base', {
                    error: 'Debes iniciar sesión para acceder a esta ruta.',
                    title: 'Ecommerce | Error',
                    route: 'login',
                    page: 'log-in'
                })
            }
            switch (role) {
                case "admin":
                    if (req.user.role == 'admin') return next()
                    res.status(401).render('errors/base', {
                        error: 'No tienes el rol autorizado (admin), para acceder a esta ruta.',
                        title: 'Ecommerce | Error',
                        route: 'products',
                        page: 'Productos'
                    })
                    break;
                case "user":
                    if (req.user.role == 'user') return next()
                    res.status(401).render('errors/base', {
                        error: 'No tienes el rol autorizado (user), para acceder a esta ruta.',
                        title: 'Ecommerce | Error',
                        route: 'products',
                        page: 'Productos'
                    })
                    break
                case "premiumOrAdmin":
                    if (req.user.role == 'premium' || req.user.role == 'admin') return next()
                    res.status(401).render('errors/base', {
                        error: 'No tienes el rol autorizado (admin o premium), para acceder a esta ruta.',
                        title: 'Ecommerce | Error',
                        route: 'products',
                        page: 'Productos'
                    })
                    break
                case "premiumOrUser":
                    if (req.user.role == 'premium' || req.user.role == 'user') return next()
                    res.status(401).render('errors/base', {
                        error: 'No tienes el rol autorizado (user o premium), para acceder a esta ruta.',
                        title: 'Ecommerce | Error',
                        route: 'products',
                        page: 'Productos'
                    })
                    break
                default:
                    next()
                    break;
            }
        })(req, res, next)
    }
}