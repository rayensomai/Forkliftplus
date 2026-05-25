import { useMemo, useState } from 'react'
import {
  buildRecommendationSummary,
  recommendForklifts,
} from '../../utils/forkliftRecommender.js'

const DEFAULT_CRITERIA = {
  terrain: 'mixed',
  capacityLb: 5000,
  liftHeightFt: 12,
  accessType: 'stacking',
  workType: 'stacking',
  narrowAisle: false,
  budgetMax: 0,
}

function ForkliftRecommender({
  copy,
  products,
  locale,
  currencyFormatter,
  onViewProduct,
  onAddToCart,
}) {
  const [criteria, setCriteria] = useState(DEFAULT_CRITERIA)
  const [phase, setPhase] = useState('idle')
  const [recommendations, setRecommendations] = useState([])
  const [summary, setSummary] = useState('')

  const accessOptions = useMemo(() => copy.accessOptions ?? [], [copy.accessOptions])

  const updateCriteria = (key, value) => {
    setCriteria((current) => {
      const next = { ...current, [key]: value }
      if (key === 'accessType') {
        next.workType =
          value === 'height'
            ? 'height'
            : value === 'horizontal'
              ? 'handling'
              : value === 'loading'
                ? 'loading'
                : 'stacking'
      }
      return next
    })
  }

  const handleAnalyze = (event) => {
    event.preventDefault()
    setPhase('thinking')

    window.setTimeout(() => {
      const results = recommendForklifts(products, criteria, locale)
      setRecommendations(results)
      setSummary(buildRecommendationSummary(criteria, results, copy, locale))
      setPhase('results')
    }, 1100)
  }

  const handleReset = () => {
    setCriteria(DEFAULT_CRITERIA)
    setRecommendations([])
    setSummary('')
    setPhase('idle')
  }

  return (
    <section className="lift-advisor reveal delay-2" aria-labelledby="lift-advisor-title">
      <div className="lift-advisor-glow" aria-hidden="true" />

      <div className="lift-advisor-header">
        <div className="lift-advisor-badge">
          <span className="lift-advisor-pulse" aria-hidden="true" />
          {copy.badge}
        </div>
        <h3 id="lift-advisor-title">{copy.title}</h3>
        <p>{copy.subtitle}</p>
      </div>

      <div className="lift-advisor-layout">
        <form className="lift-advisor-form" onSubmit={handleAnalyze}>
          <div className="lift-advisor-form-grid">
            <label className="field lift-advisor-field">
              <span>{copy.terrainLabel}</span>
              <select
                value={criteria.terrain}
                onChange={(event) => updateCriteria('terrain', event.target.value)}
              >
                {copy.terrainOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field lift-advisor-field">
              <span>{copy.capacityLabel}</span>
              <input
                type="number"
                min="500"
                max="20000"
                step="250"
                value={criteria.capacityLb}
                onChange={(event) => updateCriteria('capacityLb', Number(event.target.value) || 0)}
              />
              <small>{copy.capacityHint}</small>
            </label>

            <label className="field lift-advisor-field">
              <span>{copy.heightLabel}</span>
              <input
                type="number"
                min="0"
                max="45"
                step="1"
                value={criteria.liftHeightFt}
                onChange={(event) => updateCriteria('liftHeightFt', Number(event.target.value) || 0)}
              />
              <small>{copy.heightHint}</small>
            </label>

            <label className="field lift-advisor-field">
              <span>{copy.accessLabel}</span>
              <select
                value={criteria.accessType}
                onChange={(event) => updateCriteria('accessType', event.target.value)}
              >
                {accessOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field lift-advisor-field">
              <span>{copy.budgetLabel}</span>
              <select
                value={criteria.budgetMax}
                onChange={(event) => updateCriteria('budgetMax', Number(event.target.value))}
              >
                {copy.budgetOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="lift-advisor-checkbox">
              <input
                type="checkbox"
                checked={criteria.narrowAisle}
                onChange={(event) => updateCriteria('narrowAisle', event.target.checked)}
              />
              <span>{copy.narrowAisleLabel}</span>
            </label>
          </div>

          <div className="lift-advisor-actions">
            <button className="btn primary lift-advisor-submit" type="submit" disabled={phase === 'thinking'}>
              {phase === 'thinking' ? copy.analyzingCta : copy.analyzeCta}
            </button>
            {phase === 'results' ? (
              <button className="btn ghost" type="button" onClick={handleReset}>
                {copy.resetCta}
              </button>
            ) : null}
          </div>
        </form>

        <div className={`lift-advisor-panel ${phase === 'results' ? 'is-ready' : ''}`}>
          {phase === 'idle' ? (
            <div className="lift-advisor-idle">
              <div className="lift-advisor-orbit" aria-hidden="true">
                <span>⚡</span>
                <span>📐</span>
                <span>🏗️</span>
              </div>
              <strong>{copy.idleTitle}</strong>
              <p>{copy.idleText}</p>
              <ul>
                {copy.idlePoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {phase === 'thinking' ? (
            <div className="lift-advisor-thinking" aria-live="polite">
              <div className="lift-advisor-spinner" aria-hidden="true" />
              <strong>{copy.thinkingTitle}</strong>
              <p>{copy.thinkingText}</p>
            </div>
          ) : null}

          {phase === 'results' ? (
            <div className="lift-advisor-results">
              <p className="lift-advisor-summary">{summary}</p>
              <div className="lift-advisor-cards">
                {recommendations.map((entry, index) => (
                  <article
                    key={entry.product.id}
                    className={`lift-advisor-card ${index === 0 ? 'is-best' : ''}`}
                  >
                    <div className="lift-advisor-card-top">
                      <span className="lift-advisor-rank">
                        {index === 0 ? copy.bestMatch : copy.matchLabel.replace('{percent}', String(entry.matchPercent))}
                      </span>
                      <strong>{entry.product.name}</strong>
                      <p>{entry.product.description}</p>
                    </div>

                    <div className="lift-advisor-card-media">
                      <img src={entry.product.image} alt={entry.product.name} loading="lazy" />
                      <div className="lift-advisor-card-stats">
                        <span>{entry.product.capacityLabel}</span>
                        <span>{entry.product.terrainLabel}</span>
                        <span>
                          {copy.heightShort.replace('{value}', String(entry.productHeight))}
                        </span>
                      </div>
                    </div>

                    <ul className="lift-advisor-reasons">
                      {entry.reasons.map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>

                    <div className="lift-advisor-card-footer">
                      <strong>{currencyFormatter.format(entry.product.price)}</strong>
                      <div className="lift-advisor-card-actions">
                        <button
                          className="btn btn-small ghost"
                          type="button"
                          onClick={() => onViewProduct(entry.product)}
                        >
                          {copy.viewCta}
                        </button>
                        <button
                          className="btn btn-small primary"
                          type="button"
                          onClick={() => onAddToCart(entry.product)}
                        >
                          {copy.buyCta}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default ForkliftRecommender
