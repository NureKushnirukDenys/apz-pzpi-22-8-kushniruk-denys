// Leaf-компонент — окрема картка тайтлу (фільму або серіалу)
const TitleCard = ({ title }: { title: string }) => (
  <div className="title-card">{title}</div>
);

// Composite-компонент — ряд з категорією (наприклад, Trending Now)
const Row = ({ label, titles }: { label: string; titles: string[] }) => (
  <section className="row">
    <h3>{label}</h3>
    <div className="title-list">
      {titles.map((title) => (
        <TitleCard key={title} title={title} />
      ))}
    </div>
  </section>
);
