import { Head, Link, router } from '@inertiajs/react'
import Layout from '../../components/layout'
import { DateTime } from 'luxon'

interface Screen {
  id: number
  name: string
  accessToken: string
}

interface Content {
  id: number
  name: string
  type: 'video' | 'youtube'
  source: string
}

interface Schedule {
  id: number
  screenId: number
  contentId: number
  startTime: string
  endTime: string
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
  content: Content
}

interface ScreenShowProps {
  screen: Screen
  schedules: Schedule[]
}

export default function ScreenShow({ screen, schedules }: ScreenShowProps) {
  const handleDeleteSchedule = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette programmation ?')) {
      router.delete(`/schedules/${id}`)
    }
  }

  const formatTime = (time: string) => {
    return DateTime.fromFormat(time, 'HH:mm:ss').toFormat('HH:mm')
  }

  const getDaysOfWeek = (schedule: Schedule) => {
    const days = []
    if (schedule.monday) days.push('Lun')
    if (schedule.tuesday) days.push('Mar')
    if (schedule.wednesday) days.push('Mer')
    if (schedule.thursday) days.push('Jeu')
    if (schedule.friday) days.push('Ven')
    if (schedule.saturday) days.push('Sam')
    if (schedule.sunday) days.push('Dim')
    return days.length > 0 ? days.join(', ') : 'Aucun jour'
  }

  return (
    <Layout>
      <Head title={`Écran: ${screen.name}`} />
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link
              href="/screens"
              className="inline-flex items-center mr-4 text-sm text-gray-500 hover:text-gray-700"
            >
              <svg
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Retour
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">{screen.name}</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            {/* Information sur l'écran */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Informations de l'écran
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Détails et URL d'accès
                </p>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Nom</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {screen.name}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">URL d'accès</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <a
                        href={`/client/${screen.accessToken}`}
                        target="_blank"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        {window.location.origin}/client/{screen.accessToken}
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/client/${screen.accessToken}`)
                          alert('URL copiée dans le presse-papier')
                        }}
                        className="ml-2 p-1 bg-gray-100 rounded-md inline-flex items-center"
                        title="Copier l'URL"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Programmation des contenus */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Programmation des contenus
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Gérez les contenus qui s'affichent sur cet écran
                  </p>
                </div>
                <Link
                  href={`/screens/${screen.id}/schedules/create`}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Ajouter un contenu
                </Link>
              </div>
              <div className="border-t border-gray-200">
                {schedules.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-sm text-gray-500">
                      Aucun contenu programmé pour cet écran.
                    </p>
                    <Link
                      href={`/screens/${screen.id}/schedules/create`}
                      className="inline-flex items-center px-4 py-2 mt-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Ajouter un contenu
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contenu
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Horaires
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Jours
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {schedules.map((schedule) => (
                          <tr key={schedule.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{schedule.content.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {schedule.content.type === 'video' ? 'Vidéo' : 'YouTube'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {getDaysOfWeek(schedule)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleDeleteSchedule(schedule.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Supprimer
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
