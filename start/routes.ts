/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ScreensController = () => import('#controllers/screens_controller')
const AuthController = () => import('#controllers/auth_controller')
const ContentsController = () => import('#controllers/contents_controller')
const SchedulesController = () => import('#controllers/schedules_controller')
const DashboardController = () => import('#controllers/dashboard_controller')

router.get('/client/:token', [ScreensController, 'client'])

router.get('/login', [AuthController, 'showLogin']).as('login').use(middleware.guest())
router.post('/login', [AuthController, 'login']).use(middleware.guest())

router.get('/register', [AuthController, 'showRegister']).as('register').use(middleware.guest())
router.post('/register', [AuthController, 'register']).use(middleware.guest())

router.post('/logout', [AuthController, 'logout']).as('logout').use(middleware.auth())

// Routes protégées par l'authentification
router
  .group(() => {
    router.get('/', [DashboardController, 'index']).as('dashboard')

    router.get('/screens', [ScreensController, 'index']).as('screens.index')
    router.get('/screens/create', [ScreensController, 'create']).as('screens.create')
    router.post('/screens', [ScreensController, 'store']).as('screens.store')
    router.get('/screens/:id', [ScreensController, 'show']).as('screens.show')
    router.delete('/screens/:id', [ScreensController]).as('screens.destroy')

    router.get('/contents', [ContentsController, 'index']).as('contents.index')
    router.get('/contents/create', [ContentsController, 'create']).as('contents.create')
    router.post('/contents', [ContentsController, 'store']).as('contents.store')
    router.get('/contents/:id/edit', [ContentsController, 'edit']).as('contents.edit')
    router.put('/contents/:id', [ContentsController, 'update']).as('contents.update')
    router.delete('/contents/:id', [ContentsController, 'destroy']).as('contents.destroy')

    router
      .get('/screens/:screenId/schedules/create', [SchedulesController, 'create'])
      .as('schedules.create')
    router
      .post('/screens/:screenId/schedules', [SchedulesController, 'store'])
      .as('schedules.store')
    router.delete('/schedules/:id', [SchedulesController, 'destroy']).as('schedules.destroy')
  })
  .use(middleware.auth())
