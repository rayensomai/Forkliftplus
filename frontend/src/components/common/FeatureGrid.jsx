function FeatureGrid({ items, onItemClick }) {
  return (
    <div className="feature-grid">
      {items.map((item, index) => (
        <article
          key={item.title}
          className={`feature-card reveal delay-${(index % 3) + 1}${onItemClick ? ' feature-card-action' : ''}`}
          role={onItemClick ? 'button' : undefined}
          tabIndex={onItemClick ? 0 : undefined}
          onClick={() => onItemClick?.(item)}
          onKeyDown={(event) => {
            if (!onItemClick) return
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onItemClick(item)
            }
          }}
        >
          <div className="feature-icon">{item.icon}</div>
          <div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            {item.actionLabel ? <span className="feature-action">{item.actionLabel}</span> : null}
          </div>
          {item.tag ? <span className="badge">{item.tag}</span> : null}
        </article>
      ))}
    </div>
  )
}

export default FeatureGrid
