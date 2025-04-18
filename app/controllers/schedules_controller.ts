import { HttpContext } from '@adonisjs/core/http'
import Schedule from '#models/schedule'
import Screen from '#models/screen'
import Content from '#models/content'
import { DateTime } from 'luxon'
import { storeScheduleValidator } from '#validators/schedule'

export default class SchedulesController {
  /**
   * Displays form to create a new schedule
   */
  async create({ params, inertia, auth }: HttpContext) {
    const user = auth.user!

    const screen = await this.fetchScreenByIdOrFail(user.id, params.screenId)

    const contents = await Content.query().where('user_id', user.id)

    return inertia.render('schedules/create', { screen, contents })
  }

  /**
   * Stores a new schedule
   */
  async store({ params, request, response, auth, session }: HttpContext) {
    const user = auth.user!

    const screen = await this.fetchScreenByIdOrFail(user.id, params.screenId)

    const scheduleData = await request.validateUsing(storeScheduleValidator)

    // Check if the content belongs to the user
    const content = await Content.query()
      .where('id', scheduleData.contentId)
      .where('user_id', user.id)
      .firstOrFail()

    await Schedule.create({
      screenId: screen.id,
      contentId: content.id,
      startTime: DateTime.fromFormat(scheduleData.startTime, 'HH:mm:ss'),
      endTime: DateTime.fromFormat(scheduleData.endTime, 'HH:mm:ss'),
      monday: scheduleData.monday || false,
      tuesday: scheduleData.tuesday || false,
      wednesday: scheduleData.wednesday || false,
      thursday: scheduleData.thursday || false,
      friday: scheduleData.friday || false,
      saturday: scheduleData.saturday || false,
      sunday: scheduleData.sunday || false,
    })

    session.flash('success', 'Programmation ajoutée avec succès')
    return response.redirect().toRoute('screens.show', { id: screen.id })
  }

  /**
   * Hard deletes a specific schedule
   */
  async destroy({ params, response, auth, session }: HttpContext) {
    const user = auth.user!

    const schedule = await Schedule.query().where('id', params.id).preload('screen').firstOrFail()

    if (schedule.screen.userId !== user.id) {
      session.flash('error', "Vous n'êtes pas autorisé à supprimer cet horaire")
      return response.redirect().back()
    }

    await schedule.delete()

    session.flash('success', 'Programmation supprimée avec succès')
    return response.redirect().toRoute('screens.show', { id: schedule.screenId })
  }

  private async fetchScreenByIdOrFail(userId: number, screenId: number) {
    const screen = await Screen.query().where('id', screenId).where('user_id', userId).firstOrFail()

    return screen
  }
}
