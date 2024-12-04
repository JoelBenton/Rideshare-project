/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')
const LocationsController = () => import('#controllers/locations_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

// All routes have firebase auth middleware applied by default

router.get('/', () => {
    return {
        message: 'Hello World!',
    }
})
router.post('/check-username', [AuthController, 'checkUsername'])

router
    .group(() => {
        router.post('/sync-database', () => {}) // Middleware syncs database. This route is just to call the middleware which syncs the database
        router.resource('/locations', LocationsController).apiOnly()
        router.post('/update-user-role', [AuthController, 'updateUserRole'])
    })
    .use(middleware.auth())
