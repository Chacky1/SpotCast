import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'

export default class AuthController {
  /**
   * Displays the login form
   */
  async showLogin({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  /**
   * Logs in the user
   */
  async login({ request, response, auth, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)

    try {
      await auth.use('web').login(user)
      return response.redirect().toRoute('dashboard')
    } catch (error) {
      session.flash('errors', { form: 'Les identifiants fournis sont invalides' })
      return response.redirect().back()
    }
  }

  /**
   * Displays the registration form
   */
  async showRegister({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  /**
   * Registers a new user
   */
  async register({ request, response, auth, session }: HttpContext) {
    const data = await request.validateUsing(registerValidator)

    const existingUser = await User.findBy('email', data.email)

    if (existingUser) {
      session.flash('errors', { email: 'Cet email est déjà utilisé' })
      return response.redirect().back()
    }

    const user = await User.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    })

    await auth.use('web').login(user)

    return response.redirect().toRoute('dashboard')
  }

  /**
   * Logs out the user
   */
  async logout({ response, auth }: HttpContext) {
    await auth.use('web').logout()

    return response.redirect().toRoute('login')
  }
}
