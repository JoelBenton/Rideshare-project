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
const VehiclesController = () => import('#controllers/vehicles_controller')
const MarkersController = () => import('#controllers/passengers_controller')
const TripsController = () => import('#controllers/trips_controller')
const WhitelistsController = () => import('#controllers/whitelists_controller')
const UsersController = () => import('#controllers/user_controller')

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

// All routes have firebase auth middleware applied by default

router.get('/', () => {
    return {
        message: 'Hello World!',
    }
})
router.post('/check-username', [AuthController, 'checkUsername'])
router.post('/whitelist/check-email', [WhitelistsController, 'checkEmail'])

router
    .group(() => {
        // Routes
        router.post('/sync-database', () => {}) // Middleware syncs database. This route is just to call the middleware which synces the database
        router.post('/update-user-role', [AuthController, 'updateUserRole'])
        router.post('/trip/:trip_id/marker', [MarkersController, 'store'])
        router.post('/whitelist', [WhitelistsController, 'addEmail'])

        router.put('/markers/:id/trip-owner-update', [MarkersController, 'tripOwnerUpdate'])

        router.get('/trip/:trip_id/markers', [MarkersController, 'TripsIndex'])
        router.get('/user/:user_id/trips', [TripsController, 'userIndex'])
        router.get('/user/:user_id/trips/all', [TripsController, 'userTripsAll'])
        router.get('/trips/all', [TripsController, 'all'])
        router.get('/whitelist', [WhitelistsController, 'getWhitelist'])
        router.get('/users', [UsersController, 'index'])

        router.delete('/whitelist', [WhitelistsController, 'removeEmail'])

        // Resources
        router.resource('/locations', LocationsController).apiOnly()
        router.resource('/vehicles', VehiclesController).apiOnly()
        router.resource('/markers', MarkersController).apiOnly().except(['index', 'store'])
        router.resource('/trips', TripsController).apiOnly()
    })
    .use(middleware.auth())
