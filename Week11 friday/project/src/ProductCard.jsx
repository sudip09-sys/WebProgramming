import React from 'react';
import ExerciseLayout from './ExerciseLayout.jsx';

export function ProductCard({ name, price, rating, inStock }) {
  return (
    <article className="catalog-card product-card">
      <p className="eyebrow">SAMPLE PRODUCT</p>
      <h2>{name}</h2>
      <p className="price">{price.toLocaleString('ko-KR')}원</p>
      <p className="rating">{rating} / 5 stars</p>
      <span className={`badge ${inStock ? 'available' : 'unavailable'}`}>{inStock ? 'In Stock' : 'Out of Stock'}</span>
    </article>
  );
}

export default function ProductPage() {
  return (
    <ExerciseLayout title="PRODUCT CARDS" description="One component, different props. Sample products demonstrate KRW prices, ratings, and both stock states.">
      <section className="catalog-grid" aria-label="Sample products">
        <ProductCard name="Wireless Earbuds" price={89000} rating={4.5} inStock={true} />
        <ProductCard name="Compact Keyboard" price={69000} rating={4.2} inStock={false} />
        <ProductCard name="USB-C Hub" price={35000} rating={4} inStock={true} />
      </section>
      <p className="data-note">Practice data only. Change a prop in ProductCard.jsx to see how the same component renders different values.</p>
    </ExerciseLayout>
  );
}
