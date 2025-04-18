import React, { useState } from 'react'
import { Head, useForm, Link } from '@inertiajs/react'
import Layout from '../../components/layout'

interface Screen {
  id: number
  name: string
}

interface Content {
  id: number
  name: string
  type: 'video' | 'youtube'
  source: string
}

interface ScheduleCreateProps {
  screen: Screen
  contents: Content[]
}

export default function ScheduleCreate({ screen, contents }: ScheduleCreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    contentId: 0,
    startTime: '08:00:00',
    endTime: '20:00:00',
    monday: false as boolean,
    tuesday: false as boolean,
    wednesday: false as boolean,
    thursday: false as boolean,
    friday: false as boolean,
    saturday: false as boolean,
    sunday: false as boolean,
  })

  const [selectAllDays, setSelectAllDays] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(`/screens/${screen.id}/schedules`)
  }

  const handleSelectAllDays = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked

    setSelectAllDays(checked)

    setData(previousData => ({
      ...previousData,
      monday: checked,
      tuesday: checked,
      wednesday: checked,
      thursday: checked,
      friday: checked,
      saturday: checked,
      sunday: checked,
    }))
  }

  const handleDayChange = (day: keyof typeof data, checked: boolean) => {
    setData(previousData => ({
      ...previousData,
      [day]: checked,
    }))

    // Check if all days are selected
    if (checked) {
      if (
        data.monday &&
        data.tuesday &&
        data.wednesday &&
        data.thursday &&
        data.friday &&
        data.saturday &&
        data.sunday
      ) {
        setSelectAllDays(true)
      }
    } else {
      setSelectAllDays(false)
    }
  }

  return (
    <Layout>
      <Head title={`Ajouter une programmation - ${screen.name}`} />
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link
              href={`/screens/${screen.id}`}
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
            <h1 className="text-2xl font-semibold text-gray-900">
              Ajouter un contenu pour l'écran "{screen.name}"
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            {contents.length === 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                <div className="text-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Aucun contenu disponible
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Vous devez d'abord ajouter des contenus avant de pouvoir les programmer sur cet écran.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/contents/create"
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
                </div>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                      <label htmlFor="contentId" className="block text-sm font-medium text-gray-700">
                        Contenu à afficher
                      </label>
                      <select
                        id="contentId"
                        name="contentId"
                        className={`mt-1 block w-full py-2 px-3 border ${errors.contentId ? 'border-red-500' : 'border-gray-300'
                          } bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        value={data.contentId}
                        onChange={(e) => setData(previousData => ({
                          ...previousData,
                          contentId: parseInt(e.target.value),
                        }))}
                      >
                        <option value="">Sélectionner un contenu</option>
                        {contents.map((content) => (
                          <option key={content.id} value={content.id}>
                            {content.name} ({content.type === 'video' ? 'Vidéo' : 'YouTube'})
                          </option>
                        ))}
                      </select>
                      {errors.contentId && (
                        <p className="mt-2 text-sm text-red-600">{errors.contentId}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                          Heure de début
                        </label>
                        <input
                          type="time"
                          id="startTime"
                          name="startTime"
                          step="1"
                          className={`mt-1 block w-full py-2 px-3 border ${errors.startTime ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          value={data.startTime.substring(0, 5)}
                          onChange={(e) => setData(previousData => ({
                            ...previousData,
                            startTime: e.target.value + ':00',
                          }))}
                        />
                        {errors.startTime && (
                          <p className="mt-2 text-sm text-red-600">{errors.startTime}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                          Heure de fin
                        </label>
                        <input
                          type="time"
                          id="endTime"
                          name="endTime"
                          step="1"
                          className={`mt-1 block w-full py-2 px-3 border ${errors.endTime ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          value={data.endTime.substring(0, 5)}
                          onChange={(e) => setData(previousData => ({
                            ...previousData,
                            endTime: e.target.value + ':00',
                          }))}
                        />
                        {errors.endTime && (
                          <p className="mt-2 text-sm text-red-600">{errors.endTime}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <fieldset>
                        <legend className="text-sm font-medium text-gray-700">Jours d'affichage</legend>
                        <div className="mt-4 space-y-4">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="selectAll"
                                name="selectAll"
                                type="checkbox"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                checked={selectAllDays}
                                onChange={handleSelectAllDays}
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="selectAll" className="font-medium text-gray-700">
                                Tous les jours
                              </label>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="monday"
                                  name="monday"
                                  type="checkbox"
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                  checked={data.monday}
                                  onChange={(e) => handleDayChange('monday', e.target.checked)}
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="monday" className="font-medium text-gray-700">
                                  Lundi
                                </label>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="tuesday"
                                  name="tuesday"
                                  type="checkbox"
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                  checked={data.tuesday}
                                  onChange={(e) => handleDayChange('tuesday', e.target.checked)}
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="tuesday" className="font-medium text-gray-700">
                                  Mardi
                                </label>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="wednesday"
                                  name="wednesday"
                                  type="checkbox"
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                  checked={data.wednesday}
                                  onChange={(e) => handleDayChange('wednesday', e.target.checked)}
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="wednesday" className="font-medium text-gray-700">
                                  Mercredi
                                </label>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="thursday"
                                  name="thursday"
                                  type="checkbox"
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                  checked={data.thursday}
                                  onChange={(e) => handleDayChange('thursday', e.target.checked)}
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="thursday" className="font-medium text-gray-700">
                                  Jeudi
                                </label>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="friday"
                                  name="friday"
                                  type="checkbox"
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                  checked={data.friday}
                                  onChange={(e) => handleDayChange('friday', e.target.checked)}
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="friday" className="font-medium text-gray-700">
                                  Vendredi
                                </label>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="saturday"
                                  name="saturday"
                                  type="checkbox"
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                  checked={data.saturday}
                                  onChange={(e) => handleDayChange('saturday', e.target.checked)}
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="saturday" className="font-medium text-gray-700">
                                  Samedi
                                </label>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="sunday"
                                  name="sunday"
                                  type="checkbox"
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                  checked={data.sunday}
                                  onChange={(e) => handleDayChange('sunday', e.target.checked)}
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="sunday" className="font-medium text-gray-700">
                                  Dimanche
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        {(errors.monday || errors.tuesday || errors.wednesday || errors.thursday ||
                          errors.friday || errors.saturday || errors.sunday) && (
                            <p className="mt-2 text-sm text-red-600">Veuillez sélectionner au moins un jour</p>
                          )}
                      </fieldset>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <Link
                        href={`/screens/${screen.id}`}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                      >
                        Annuler
                      </Link>
                      <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {processing ? "Ajout en cours..." : "Ajouter la programmation"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
