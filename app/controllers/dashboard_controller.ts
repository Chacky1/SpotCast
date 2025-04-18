import { HttpContext } from '@adonisjs/core/http'
import Screen from '#models/screen'
import Content from '#models/content'

export default class DashboardController {
  /**
   * Displays the dashboard for the authenticated user
   */
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!

    const screens = await Screen.query().where('user_id', user.id)

    const contents = await Content.query().where('user_id', user.id)

    const screenCount = screens.length
    const contentCount = contents.length

    return inertia.render('dashboard', {
      screenCount,
      contentCount,
      screens,
      contents,
    })
  }
}
