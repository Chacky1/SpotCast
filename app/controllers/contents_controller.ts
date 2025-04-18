import { HttpContext } from '@adonisjs/core/http'
import Content from '#models/content'
import { storeContentValidator, updateContentValidator } from '#validators/content'

export default class ContentsController {
  /**
   * Displays the list of contents for the authenticated user
   */
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!

    const contents = await Content.query().where('user_id', user.id)

    return inertia.render('contents/index', { contents })
  }

  /**
   * Displays the form to create a new content
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('contents/create')
  }

  /**
   * Stores a new content
   */
  async store({ request, response, auth, session }: HttpContext) {
    const { name, type, source } = await request.validateUsing(storeContentValidator)

    const user = auth.user!

    await Content.create({
      name,
      type,
      source,
      userId: user.id,
    })

    session.flash('success', 'Contenu ajouté avec succès')
    return response.redirect().toRoute('contents.index')
  }

  /**
   * Displays form to edit a specific content
   */
  async edit({ params, inertia, auth }: HttpContext) {
    const user = auth.user!

    const content = await this.fetchContentByIdOrFail(user.id, params.id)

    return inertia.render('contents/edit', { content })
  }

  /**
   * Updates a specific content
   */
  async update({ params, request, response, auth, session }: HttpContext) {
    const { name, type, source } = await request.validateUsing(updateContentValidator)

    const user = auth.user!

    const content = await this.fetchContentByIdOrFail(user.id, params.id)

    content.name = name || content.name
    content.type = type || content.type
    content.source = source || content.source

    await content.save()

    session.flash('success', 'Contenu mis à jour avec succès')
    return response.redirect().toRoute('contents.index')
  }

  /**
   * Hard deletes a specific content
   */
  async destroy({ params, response, auth, session }: HttpContext) {
    const user = auth.user!

    const content = await this.fetchContentByIdOrFail(user.id, params.id)

    await content.delete()

    session.flash('success', 'Contenu supprimé avec succès')
    return response.redirect().toRoute('contents.index')
  }

  private async fetchContentByIdOrFail(userId: number, contentId: number) {
    const content = await Content.query()
      .where('id', contentId)
      .where('user_id', userId)
      .firstOrFail()

    return content
  }
}
