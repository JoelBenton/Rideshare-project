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

// All routes have firebase auth middleware applied by default

router.get('/', () => {
    return {
        message: 'Hello World!',
    }
})
router.post('/login', [AuthController, 'registerOrLogin'])
router.resource('/locations', LocationsController).apiOnly()
