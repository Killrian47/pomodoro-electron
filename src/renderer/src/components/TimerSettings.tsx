import React, { useEffect, useState } from 'react'
import type { Settings } from '../types/storage'

const TimerSettings: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    // On récupère les settings depuis le back (main)
    window.api
      .getData()
      .then((data) => {
        setSettings(data.settings)
        setLoading(false)
      })
      .catch(() => {
        setMessage('Erreur lors du chargement des réglages')
        setLoading(false)
      })
  }, [])

  const handleChange = (field: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settings) return
    const value =
      field === 'autoStart' || field === 'soundEnabled'
        ? (e.target as HTMLInputElement).checked
        : Number(e.target.value)

    setSettings({ ...settings, [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!settings) return

    setSaving(true)
    setMessage(null)
    try {
      const updated = await window.api.updateSettings(settings)
      setSettings(updated)
      setMessage('Réglages sauvegardés ✅')
    } catch (err) {
      console.error(err)
      setMessage('Erreur lors de la sauvegarde ❌')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !settings) {
    return <p className="bottom-text">Chargement des réglages...</p>
  }

  return (
    <div className="settings">
      <h2 className="settings-title">Réglages du timer</h2>

      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="settings-field">
          <label>Durée de travail (minutes)</label>
          <input
            type="number"
            min={1}
            max={180}
            value={settings.workDuration}
            onChange={handleChange('workDuration')}
          />
        </div>

        <div className="settings-field">
          <label>Durée de pause (minutes)</label>
          <input
            type="number"
            min={1}
            max={60}
            value={settings.breakDuration}
            onChange={handleChange('breakDuration')}
          />
        </div>

        <div className="settings-field settings-field--row">
          <label>Démarrer automatiquement la prochaine session</label>
          <input
            type="checkbox"
            checked={settings.autoStart}
            onChange={handleChange('autoStart')}
          />
        </div>

        <div className="settings-field settings-field--row">
          <label>Activer le son à la fin</label>
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={handleChange('soundEnabled')}
          />
        </div>

        <button type="submit" className="control-btn control-btn--primary" disabled={saving}>
          {saving ? 'Sauvegarde...' : 'Enregistrer'}
        </button>

        {message && <p className="bottom-text">{message}</p>}
      </form>
    </div>
  )
}

export default TimerSettings
