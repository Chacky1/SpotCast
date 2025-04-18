import { HttpContext } from '@adonisjs/core/http'
import Screen from '#models/screen'
import { randomUUID } from 'node:crypto'

export default class ScreensController {
  /**
   * Displays the list of screens for the authenticated user
   */
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const screens = await Screen.query().where('user_id', user.id)

    return inertia.render('screens/index', { screens })
  }

  /**
   * Displays the form to create a new screen
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('screens/create')
  }

  /**
   * Stores a new screen
   */
  async store({ request, response, auth, session }: HttpContext) {
    const data = request.only(['name'])
    const user = auth.user!

    const accessToken = randomUUID()

    await Screen.create({
      name: data.name,
      userId: user.id,
      accessToken,
    })

    session.flash('success', 'Écran créé avec succès')
    return response.redirect().toRoute('screens.index')
  }

  /**
   * Displays a specific screen (backoffice)
   */
  async show({ params, inertia, auth }: HttpContext) {
    const user = auth.user!

    const screen = await this.fetchScreenByIdOrFail(user.id, params.id)

    const schedules = await screen.related('schedules').query().preload('content')

    return inertia.render('screens/show', { screen, schedules })
  }

  /**
   * Hard deletes a specific screen
   */
  async destroy({ params, response, auth, session }: HttpContext) {
    const user = auth.user!

    const screen = await this.fetchScreenByIdOrFail(user.id, params.id)

    await screen.delete()

    session.flash('success', 'Écran supprimé avec succès')
    return response.redirect().toRoute('screens.index')
  }

  /**
   * Displays the screen result for the client (screen side)
   */
  async client({ params, view }: HttpContext) {
    const screen = await Screen.findByOrFail('access_token', params.token)

    const schedules = await screen.related('schedules').query().preload('content')

    return view.render('screens/client', { screen, schedules })
  }

  private fetchScreenByIdOrFail(userId: number, screenId: number) {
    return Screen.query().where('id', screenId).where('user_id', userId).firstOrFail()
  }
}
