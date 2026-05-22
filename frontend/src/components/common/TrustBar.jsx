function TrustBar({ copy }) {
  return (
    <section className="trust-bar">
      {copy.items.map((item) => (
        <div key={item.label} className="trust-item">
          <span>{item.value}</span>
          <p>{item.label}</p>
        </div>
      ))}
    </section>
  )
}

export default TrustBar
