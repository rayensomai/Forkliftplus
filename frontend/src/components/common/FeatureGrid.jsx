function FeatureGrid({ items }) {
  return (
    <div className="feature-grid">
      {items.map((item, index) => (
        <article
          key={item.title}
          className={`feature-card reveal delay-${(index % 3) + 1}`}
        >
          <div className="feature-icon">{item.icon}</div>
          <div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
          {item.tag ? <span className="badge">{item.tag}</span> : null}
        </article>
      ))}
    </div>
  )
}

export default FeatureGrid
