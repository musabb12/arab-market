import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Icon from './Icons.jsx'
import { uploadImageFile, uploadImageFiles } from '../utils/imageUpload.js'

function parseList(value, values, multiple) {
  if (multiple) {
    if (Array.isArray(values)) return values.filter(Boolean)
    if (Array.isArray(value)) return value.filter(Boolean)
    // Split only on newlines — never commas (data URLs contain commas)
    return String(value || '')
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return value ? [value] : []
}

/**
 * Reusable image picker: device upload + optional URL.
 * Single: value/onChange(url)
 * Multiple: values/onChangeValues(array) preferred; value/onChange(newline-joined) also supported
 */
export default function ImageUploader({
  value = '',
  onChange,
  values,
  onChangeValues,
  multiple = false,
  label,
  hint,
  className = ''
}) {
  const { t } = useTranslation()
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [showUrl, setShowUrl] = useState(false)
  const [urlDraft, setUrlDraft] = useState('')
  const [error, setError] = useState('')

  const list = parseList(value, values, multiple)

  const emit = (nextList) => {
    const clean = nextList.filter(Boolean)
    if (multiple) {
      if (onChangeValues) onChangeValues(clean)
      else onChange?.(clean.join('\n'))
    } else {
      onChange?.(clean[0] || '')
    }
  }

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f.type?.startsWith('image/'))
    if (!files.length) return
    setBusy(true)
    setError('')
    try {
      if (multiple) {
        const uploaded = await uploadImageFiles(files)
        emit([...list, ...uploaded])
      } else {
        const url = await uploadImageFile(files[0])
        emit([url])
      }
    } catch {
      setError(t('common.uploadFailed', { defaultValue: 'Upload failed' }))
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const removeAt = (idx) => {
    emit(list.filter((_, i) => i !== idx))
  }

  const move = (idx, dir) => {
    if (!multiple) return
    const next = [...list]
    const j = idx + dir
    if (j < 0 || j >= next.length) return
    ;[next[idx], next[j]] = [next[j], next[idx]]
    emit(next)
  }

  const addUrl = () => {
    const u = urlDraft.trim()
    if (!u) return
    emit(multiple ? [...list, u] : [u])
    setUrlDraft('')
    if (!multiple) setShowUrl(false)
  }

  const uploadLabel = multiple
    ? (list.length
      ? t('common.addMoreImages', { defaultValue: 'Add more photos' })
      : t('common.uploadImages', { defaultValue: 'Upload photos' }))
    : t('common.uploadImage', { defaultValue: 'Upload from device' })

  return (
    <div className={className}>
      {label && (
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <p className="block text-xs font-semibold text-slate-700">{label}</p>
          {multiple && list.length > 0 && (
            <span className="text-[11px] font-semibold text-slate-600">
              {t('common.imagesCount', { count: list.length, defaultValue: '{{count}} photos' })}
            </span>
          )}
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={`rounded-2xl border-2 border-dashed transition-colors p-4 ${
          dragOver ? 'border-brand-500 bg-brand-50' : 'border-slate-300 bg-white'
        }`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl bg-midnight-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-midnight-800 disabled:opacity-50"
          >
            <Icon name="upload" size={16} />
            {busy ? t('common.uploading', { defaultValue: 'Uploading…' }) : uploadLabel}
          </button>
          <button
            type="button"
            onClick={() => setShowUrl((v) => !v)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-midnight-900"
          >
            <Icon name="link" size={16} />
            {t('common.useUrl', { defaultValue: 'Use URL' })}
          </button>
          <p className="text-xs font-medium text-slate-600">
            {hint || (multiple
              ? t('common.uploadHintMultiple', { defaultValue: 'Select or drag several images at once (JPG, PNG, WebP)' })
              : t('common.uploadHint', { defaultValue: 'Drag & drop or choose a file (JPG, PNG, WebP)' }))}
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {showUrl && (
          <div className="mt-3 flex gap-2">
            <input
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addUrl() } }}
              placeholder="https://"
              className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-500 placeholder:text-slate-500"
            />
            <button type="button" onClick={addUrl} className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white">
              {t('common.add', { defaultValue: 'Add' })}
            </button>
          </div>
        )}

        {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}

        {list.length > 0 && (
          <div className={`mt-4 grid gap-3 ${multiple ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {list.map((src, idx) => (
              <div key={`${String(src).slice(0, 40)}-${idx}`} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <img src={src} alt="" className="h-28 w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-midnight-900/80 to-transparent p-2">
                  {multiple && (
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => move(idx, -1)}
                        disabled={idx === 0}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-midnight-900 disabled:opacity-30"
                        aria-label={t('common.movePrev', { defaultValue: 'Move earlier' })}
                      >
                        <Icon name="chevronLeft" size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(idx, 1)}
                        disabled={idx === list.length - 1}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-midnight-900 disabled:opacity-30"
                        aria-label={t('common.moveNext', { defaultValue: 'Move later' })}
                      >
                        <Icon name="chevronRight" size={14} />
                      </button>
                    </div>
                  )}
                  <span className="ms-auto text-[10px] font-bold text-white/90">{idx + 1}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeAt(idx)}
                  className="absolute top-2 end-2 flex h-8 w-8 items-center justify-center rounded-full bg-midnight-900/85 text-white opacity-90 hover:bg-red-600"
                  aria-label={t('common.remove', { defaultValue: 'Remove' })}
                >
                  <Icon name="close" size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
